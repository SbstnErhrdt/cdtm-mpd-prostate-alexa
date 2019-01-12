'use strict';
const Alexa = require('alexa-sdk');

//======================================================================================
// Variables
//======================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this:  var APP_ID = "amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1";
const APP_ID = undefined;

// Threshold of the max wrong answers
// If there are more wrong answers than the threshold the call a doctor
const EMERGENCY_QUESTION_THRESHOLD = 10;
const EMERGENCY_SELECT_THRESHOLD = 10;
const EMERGENCY_DESCRIBE_THRESHOLD = 10;

const EMERGENCY_UNDERSTANDING_THRESHOLD = 10;
// How many questions of the questionnaire should be asked
const MAX_QUESTIONS = 3;//8;
// How many image select questions should be asked
const MAX_SELECT_QUESTIONS = 2;//;
// How many image describe questions should be asked
const MAX_DESCRIBE_QUESTIONS = 4;//;

// Answers if the answer was right or wrong
const speechConsCorrect = ["Ok", "Thank you", "Understood"];
const speechConsWrong = ["Ok", "Thank you", "Understood"];

// This is the welcome message for when a user starts the skill without a specific intent.
const WELCOME_MESSAGE = "Hello and welcome to Prostate! <break time=\"300ms\"/> " +
    "Your symptom tracking app for prostate cancer patients  <break time=\"300ms\"/>" +
    "Please say start to begin with the test.";

// This is the message a user will hear when they start a quiz.
const START_QUIZ_MESSAGE = 'OK. I will ask you now a couple of questions. ' +
    'Please answer with yes or no. <break time=\"1s\"/>';
// This is the message a user will hear when they are in the select section of the skill
const START_QUIZ_SELECT_MESSAGE = 'I will show you now a couple of images and ask you a question.' +
    'Please press the image that fits the anwer.<break time=\"1s\"/>';
// This is the message a user will hear when they are in the describe section of the skill
const START_QUIZ_DESCRIBE_MESSAGE = 'I will now show an image and will ask you a question.<break time=\"0.5s\"/>';

// The user will hear the emergency understanding message if they have said not yes or no
const EMERGENCY_UNDERSTANDING_MESSAGE = "It seems that I do not understand you.";

// This is the message a user will hear when they try to cancel or stop the skill, or when they finish a quiz.
const EXIT_SKILL_MESSAGE = "Thank you very much for using pro-state";

// This is the message a user will hear after they ask (and hear) about a specific data element.
// const REPROMPT_SPEECH = "Können Sie das bitte wiederholen?";

// This is the message a user will hear when they ask Alexa for help in your skill.
const HELP_MESSAGE = "Hello and welcome to Prostate! <break time=\"300ms\"/> " +
    "Your symptom tracking app for prostate cancer patients  <break time=\"300ms\"/>" +
    "Please say start to begin with the test.";


// These next four values are for the Alexa cards that are created when a user asks about one of the data elements.
// This only happens outside of a quiz.

// If you don't want to use cards in your skill, set the USE_IMAGES_FLAG to false.
// If you set it to true, you will need an image for each
//item in your data.
const USE_IMAGES_FLAG = true;
const IMAGE_FALLBACK = "https://s3.eu-central-1.amazonaws.com/prostate/start.jpg";

//======================================================================================
// EXTERNAL QUESTIONS
//======================================================================================

//======================================================================================
// Questions
//======================================================================================
const questions = require("./questions/questions-questionnaire.json").questions;
//======================================================================================
// Select Questions
//======================================================================================
const selectQuestions = require("./questions/questions-select.json").questions;
//======================================================================================
// Describe Image
//======================================================================================
const describeQuestions = require("./questions/questions-describe.json").questions;

//======================================================================================
// The skill
//======================================================================================

let counter = 0;

// The different stats of the skill
const states = {
    START: "_START",
    QUIZ: "_QUIZ",
    DESCRIBEQUIZ: "_DESCRIBEQUIZ",
    SELECTQUIZ: "_SELECTQUIZ",
};

// The default handlers
const handlers = {
    "LaunchRequest": function () {
        this.handler.state = states.START;
        this.emitWithState("start");
    },
    "QuizIntent": function () {
        this.handler.state = states.QUIZ;
        this.emitWithState("Quiz");
    },
    "AnswerIntent": function () {
        this.handler.state = states.START;
        this.emitWithState("AnswerIntent");
    },
    "AMAZON.HelpIntent": function () {
        this.response.speak(HELP_MESSAGE).listen(HELP_MESSAGE);
        this.emit(":responseReady");
    },
    "Unhandled": function () {
        this.handler.state = states.START;
        this.emitWithState("Start");
    },
    "AMAZON.PreviousIntent": function () {
        this.handler.state = states.START;
        this.emitWithState("Start");
    },
    "AMAZON.NextIntent": function () {
        this.handler.state = states.START;
        this.emitWithState("Start");
    }
};

// The initial handlers
const startHandlers = Alexa.CreateStateHandler(states.START, {
    "Start": function () {
        this.response.speak(WELCOME_MESSAGE).listen(HELP_MESSAGE);
        this.emit(":responseReady");
    },
    "AnswerIntent": function () {
        // Ask proactive questions
        this.response.speak("Please say start to begin").listen("Lets go!");
        this.emit(":responseReady");
    },
    "QuizIntent": function () {
        this.handler.state = states.QUIZ;
        this.attributes["STATE"] = this.handler.state;
        console.log("IN QUIZ INTENT " + this.handler.state);
        console.log("IN QUIZ INTENT " + JSON.stringify(this.attributes));
        this.emitWithState("Quiz");
    },
    "AMAZON.StopIntent": function () {
        this.response.speak(EXIT_SKILL_MESSAGE);
        this.emit(":responseReady");
    },
    "AMAZON.CancelIntent": function () {
        this.response.speak(EXIT_SKILL_MESSAGE);
        this.emit(":responseReady");
    },
    "AMAZON.HelpIntent": function () {
        this.response.speak(HELP_MESSAGE).listen(HELP_MESSAGE);
        this.emit(":responseReady");
    },
    "Unhandled": function () {
        this.response.speak(HELP_MESSAGE).listen(HELP_MESSAGE);
        this.emit(":responseReady");
    },
    "AMAZON.PreviousIntent": function () {
        this.response.speak(HELP_MESSAGE).listen(HELP_MESSAGE);
        this.emit(":responseReady");
    },
    "AMAZON.NextIntent": function () {
        this.response.speak(HELP_MESSAGE).listen(HELP_MESSAGE);
        this.emit(":responseReady");
    }
});

// The questionnaire quiz handler
const quizHandlers = Alexa.CreateStateHandler(states.QUIZ, {
    "Quiz": function () {
        this.attributes["response"] = "";
        this.attributes["counter"] = 0;
        this.attributes["answerNotUnderstoodCounter"] = 0;
        this.emitWithState("AskQuestion");
    },
    "AskQuestion": function () {
        console.log("in askQuestion: " + JSON.stringify(this.attributes));
        // Add the welcome message if the
        if (this.attributes["counter"] === 0 && this.attributes["answerNotUnderstoodCounter"] === 0) {
            this.attributes["response"] = START_QUIZ_MESSAGE + " ";
        }
        // Get the current item of the questions
        let item = questions[this.attributes["counter"]];
        // Store correct answers in session attributes
        this.attributes["questionItem"] = item;
        this.attributes["question"] = item.question;
        this.attributes["questionType"] = item.questionType;
        // Generate the answer list
        // YES / NO
        let answerList = item.answers;
        // Get the question
        let question = getQuestion(item);
        let speech = this.attributes["response"] + question;
        // check if we can use the display
        if (USE_IMAGES_FLAG) {
            // Shuffle the answers
            let shuffledMultipleChoiceList = shuffle(answerList);
            // Generate the list items
            let listItems = shuffledMultipleChoiceList.map((x) => {
                return {
                    "token": x,
                    "textContent": {
                        "primaryText":
                            {
                                "text": x,
                                "type": "PlainText"
                            }
                    }
                }
            });
            // Generate the content
            let content = {
                "hasDisplaySpeechOutput": speech,
                "hasDisplayRepromptText": question,
                "noDisplaySpeechOutput": speech,
                "noDisplayRepromptText": question,
                "simpleCardTitle": getCardTitle(item),
                "simpleCardContent": getTextDescription(item),
                "listTemplateTitle": (this.attributes["counter"] + 1) + " : " + getCardTitle(item),
                "templateToken": "MultipleChoiceListView",
                "askOrTell": ":ask",
                "listItems": listItems,
                "hint": "Bitte sagen Sie Ja oder Nein.",
                "sessionAttributes": this.attributes
            };
            // Set the background image if there is one
            content["backgroundImageLargeUrl"] = getBackgroundImage(item);
            console.log("ASK Question event: " + JSON.stringify(this.event));
            // Render the template
            renderTemplate.call(this, content);
        } else {
            this.response.speak(speech).listen(question);
            this.emit(":responseReady");
        }
    },
    "ElementSelected": function () {
        // We will look for the value in this.event.request.token in the AnswerIntent call to getSlotValues
        console.log("in ElementSelected QUIZ state");
        this.emitWithState("AnswerIntent");
    },
    "Emergency": function () {
        this.response.speak(EMERGENCY_UNDERSTANDING_MESSAGE);
        this.emit(":tell");
    },
    "AnswerIntent": function () {
        let response = "";
        let item = this.attributes["questionItem"];
        let questionType = this.attributes["questionType"];
        let reqValue = getSlotValues(this.event);
        console.log(reqValue);

        // Get the right and the wrong answer
        // YESNO -> YES
        // NOYES -> NO
        let rightAnswer = getRightAnswer(questionType);
        // YESNO -> NO
        // NOYES -> YES
        let wrongAnswer = getWrongAnswer(questionType);

        // Correct answer
        if (rightAnswer === reqValue) {
            response = getSpeechCon(true);
            this.attributes["score"]++;
        }
        // Wrong answer
        else if (wrongAnswer === reqValue) {
            response = getSpeechCon(false);
        } else {
            // Not understood
            this.attributes["answerNotUnderstoodCounter"]++;
            // If alexa can not understand to often
            // Go to emergency state
            if (this.attributes["answerNotUnderstoodCounter"] > EMERGENCY_UNDERSTANDING_THRESHOLD) {
                this.emitWithState("Emergency");
            } else {
                console.log("Not understood");
                response = "I'm afraid I didn't hear you. Could you repeat the answer with either yes or no. " +
                    'I now repeat the question for you. <break time="1s"/>';
                this.attributes["response"] = response;
                // Subtract state if correct answer
                if (this.attributes["answerNotUnderstoodCounter"] > 0) {
                    this.attributes["answerNotUnderstoodCounter"]--;
                }
                this.emitWithState("AskQuestion");
            }
        }
        // If all is fine go further
        this.attributes["counter"]++;

        // If the questions are not finished go to the next question
        if (this.attributes["counter"] < MAX_QUESTIONS) {
            this.attributes["response"] = response;
            this.emitWithState("AskQuestion");
        } else {
            // If the score is higher than the threshold
            if (this.attributes["score"] > EMERGENCY_QUESTION_THRESHOLD) {
                response = "Bitte kontaktieren Sie umgehend einen Arzt!";
            } else {
                // Check if the device supports a display
                // If so then go to the next sections (display needed for photo selection and description tasks)
                if (supportsDisplay.call(this) || isSimulator.call(this)) {
                    this.handler.state = states.SELECTQUIZ;
                    this.attributes['STATE'] = this.handler.state;
                    console.log("IN QUIZ INTENT " + this.handler.state);
                    console.log("IN QUIZ INTENT " + JSON.stringify(this.attributes));
                    this.emitWithState("Quiz");
                } else {
                    // If the device has no display
                    // Terminate here
                    response = "Es scheint alles in Ordnung zu sein.";
                }
            }
            if (supportsDisplay.call(this) || isSimulator.call(this)) {
                //this device supports a display
                let content = {
                    "hasDisplaySpeechOutput": response + " " + EXIT_SKILL_MESSAGE,
                    "bodyTemplateContent": response,
                    "templateToken": "FinalScoreView",
                    "askOrTell": ":tell",
                    "sessionAttributes": this.attributes
                };
                if (USE_IMAGES_FLAG) {
                    content["backgroundImageUrl"] = getBackgroundImage(item);
                }
                renderTemplate.call(this, content);
            } else {
                this.response.speak(response + " " + EXIT_SKILL_MESSAGE);
                this.emit(":responseReady");
            }
        }
    },
    "AMAZON.StartOverIntent": function () {
        this.emitWithState("Quiz");
    },
    "AMAZON.StopIntent": function () {
        this.response.speak(EXIT_SKILL_MESSAGE);
        this.emit(":responseReady");
    },
    "AMAZON.CancelIntent": function () {
        this.response.speak(EXIT_SKILL_MESSAGE);
        this.emit(":responseReady");
    },
    "AMAZON.HelpIntent": function () {
        this.response.speak(HELP_MESSAGE).listen(HELP_MESSAGE);
        this.emit(":responseReady");
    },
    "Unhandled": function () {
        this.emitWithState("AnswerIntent");
    },
    "AMAZON.PreviousIntent": function () {
        this.emitWithState("AnswerIntent");
    },
    "AMAZON.NextIntent": function () {
        this.emitWithState("AnswerIntent");
    }
});

// The select quiz handler
const selectQuizHandlers = Alexa.CreateStateHandler(states.SELECTQUIZ, {
    "Quiz": function () {
        this.attributes["response"] = "";
        this.attributes["selectCounter"] = 0;
        this.attributes["selectScore"] = 0;
        this.attributes["answerNotUnderstoodCounter"] = 0;
        this.emitWithState("AskQuestion");
    },
    "AskQuestion": function () {
        console.log("in askQuestion: " + JSON.stringify(this.attributes));
        if (this.attributes["selectCounter"] === 0) {
            this.attributes["response"] = START_QUIZ_SELECT_MESSAGE + " ";
        }
        // Get the item from the list
        let item = selectQuestions[this.attributes["selectCounter"]];
        // store correct answers in session attributes
        this.attributes["questionItem"] = item;
        this.attributes["question"] = item.question;
        this.attributes["questionType"] = item.questionType;
        this.attributes["rightAnswer"] = item.rightAnswer;
        // Create list of possible answers to display on Echo Show (3 wrong, 1 right).
        let answerList = item.answers;
        //console.log("answerList: "+JSON.stringify(answerList));
        let question = getQuestion(item);
        let speech = this.attributes["response"] + question;
        // Shuffle the images
        let listItems = shuffle(answerList);
        // Generate the content
        let content = {
            "hasDisplaySpeechOutput": speech,
            "hasDisplayRepromptText": question,
            "noDisplaySpeechOutput": speech,
            "noDisplayRepromptText": question,
            "simpleCardTitle": getCardTitle(item),
            "simpleCardContent": getTextDescription(item),
            "listTemplateTitle": (this.attributes["selectCounter"] + 1) + " : " + getCardTitle(item),
            //"listTemplateContent" : getTextDescription(item),
            "templateToken": "SelectListView",
            "askOrTell": ":ask",
            "listItems": listItems,
            "hint": "Bitte drücken Sie auf das richtige Bild.",
            "sessionAttributes": this.attributes
        };
        if (USE_IMAGES_FLAG) {
            content["backgroundImageLargeUrl"] = getBackgroundImage(item);
        }
        console.log("ASK Question event: " + JSON.stringify(this.event));
        // Render the template
        renderTemplate.call(this, content);
    },
    "ElementSelected": function () {
        // We will look for the value in this.event.request.token in the AnswerIntent call to getSlotValues
        console.log("in ElementSelected QUIZ state");
        this.emitWithState("AnswerIntent");
    },
    "Emergency": function () {
        this.response.speak(EMERGENCY_UNDERSTANDING_MESSAGE);
        this.emit(":tell");
    },
    "AnswerIntent": function () {
        let response = "";
        let item = this.attributes["questionItem"];
        let reqValue = getSlotValues(this.event);
        let rightAnswer = this.attributes["rightAnswer"];

        console.log("Selected answer:", reqValue);
        console.log("Real answer", rightAnswer);
        // Correct answer
        if (rightAnswer === reqValue) {
            response = getSpeechCon(true);
        } else {
            response = getSpeechCon(false);
            this.attributes["selectScore"]++;
        }
        this.attributes["selectCounter"]++;


        // If the questions are not finished go to the next question
        if (this.attributes["selectCounter"] < MAX_SELECT_QUESTIONS) {
            this.attributes["response"] = response;
            this.emitWithState("AskQuestion");
        } else {
            // If the score is higher than the threshold
            if (this.attributes["selectScore"] > EMERGENCY_SELECT_THRESHOLD) {
                response = "Please contact your doctor immediately!";
            } else {
                // Jump to the next quiz section
                // Go to Describe
                this.handler.state = states.DESCRIBEQUIZ;
                this.attributes['STATE'] = this.handler.state;
                console.log("IN QUIZ INTENT " + this.handler.state);
                console.log("IN QUIZ INTENT " + JSON.stringify(this.attributes));
                this.emitWithState("Quiz");
            }

            if (supportsDisplay.call(this) || isSimulator.call(this)) {
                //this device supports a display

                let content = {
                    "hasDisplaySpeechOutput": response + " " + EXIT_SKILL_MESSAGE,
                    "bodyTemplateContent": response,
                    "templateToken": "FinalScoreView",
                    "askOrTell": ":tell",
                    "sessionAttributes": this.attributes
                };
                if (USE_IMAGES_FLAG) {
                    content["backgroundImageUrl"] = getBackgroundImage(item);
                }
                renderTemplate.call(this, content);


            } else {

                this.response.speak(response + " " + EXIT_SKILL_MESSAGE);
                this.emit(":responseReady");
            }
        }
    },
    "AMAZON.StartOverIntent": function () {
        this.emitWithState("Quiz");
    },
    "AMAZON.StopIntent": function () {
        this.response.speak(EXIT_SKILL_MESSAGE);
        this.emit(":responseReady");
    },
    "AMAZON.CancelIntent": function () {
        this.response.speak(EXIT_SKILL_MESSAGE);
        this.emit(":responseReady");
    },
    "AMAZON.HelpIntent": function () {
        this.response.speak(HELP_MESSAGE).listen(HELP_MESSAGE);
        this.emit(":responseReady");
    },
    "Unhandled": function () {
        this.emitWithState("AnswerIntent");
    },
    "AMAZON.PreviousIntent": function () {
        this.emitWithState("AnswerIntent");
    },
    "AMAZON.NextIntent": function () {
        this.emitWithState("AnswerIntent");
    }
});

// The describe quiz handler
const describeQuizHandlers = Alexa.CreateStateHandler(states.DESCRIBEQUIZ, {
    "Quiz": function () {
        this.attributes["response"] = "";
        this.attributes["describeCounter"] = 0;
        this.attributes["describeScore"] = 0;
        this.attributes["answerNotUnderstoodCounter"] = 0;
        this.emitWithState("AskQuestion");
    },
    "AskQuestion": function () {
        console.log("in askQuestion: " + JSON.stringify(this.attributes));
        if (this.attributes["describeCounter"] === 0) {
            this.attributes["response"] = START_QUIZ_DESCRIBE_MESSAGE + " ";
        }
        let item = describeQuestions[this.attributes["describeCounter"]];
        // store correct answers in session attributes
        this.attributes["questionItem"] = item;
        this.attributes["question"] = item.question;
        this.attributes["questionType"] = item.questionType;
        this.attributes["rightAnswer"] = item.rightAnswer;
        //console.log("answerList: "+JSON.stringify(answerList));
        let question = getQuestion(item);
        let speech = this.attributes["response"] + question;
        // Generate the content
        let content = {
            "hasDisplaySpeechOutput": speech,
            "hasDisplayRepromptText": question,
            "noDisplaySpeechOutput": speech,
            "noDisplayRepromptText": question,
            "simpleCardTitle": getCardTitle(item),
            "simpleCardContent": getTextDescription(item),
            "listTemplateTitle": (this.attributes["describeCounter"] + 1) + " : " + getCardTitle(item),
            //"listTemplateContent" : getTextDescription(item),
            "templateToken": "DescribeView",
            "askOrTell": ":ask",
            "image": item.image,
            "hint": "Pleas press the right image.",
            "sessionAttributes": this.attributes
        };
        // Set the background image
        if (USE_IMAGES_FLAG) {
            content["backgroundImageLargeUrl"] = getBackgroundImage(item);
        }
        console.log("ASK Question event: " + JSON.stringify(this.event));
        // Render the template
        renderTemplate.call(this, content);
    },
    "ElementSelected": function () {
        // We will look for the value in this.event.request.token in the AnswerIntent call to getSlotValues
        console.log("in ElementSelected QUIZ state");
        this.emitWithState("AnswerIntent");
    },
    "Emergency": function () {
        this.response.speak(EMERGENCY_UNDERSTANDING_MESSAGE);
        this.emit(":tell");
    },
    "AnswerIntent": function () {
        let response = "";
        let item = this.attributes["questionItem"];
        let reqValue = getSlotValues(this.event);
        let rightAnswer = this.attributes["rightAnswer"];
        //
        console.log("Selected answer:", reqValue);
        console.log("Real answer", rightAnswer);
        // Correct answer
        if (rightAnswer === reqValue) {
            response = getSpeechCon(true);
            this.attributes["describeScore"]++;
        } else {
            response = getSpeechCon(false);
        }
        this.attributes["describeCounter"]++;
        // If the questions are not finished go to the next question
        if (this.attributes["describeCounter"] < MAX_DESCRIBE_QUESTIONS) {
            this.attributes["response"] = response;
            this.emitWithState("AskQuestion");
        } else {
            // If the score is higher than the threshold
            if (this.attributes["describeScore"] < EMERGENCY_DESCRIBE_THRESHOLD) {
                response = "Bitte kontaktieren Sie umgehend einen Arzt!";
            } else {
                response = "Es scheint alles in Ordnung zu sein.";
            }
            // Check if the support
            if (supportsDisplay.call(this) || isSimulator.call(this)) {
                //this device supports a display
                let content = {
                    "hasDisplaySpeechOutput": response + " " + EXIT_SKILL_MESSAGE,
                    "bodyTemplateContent": response,
                    "templateToken": "FinalScoreView",
                    "askOrTell": ":tell",
                    "sessionAttributes": this.attributes
                };
                if (USE_IMAGES_FLAG) {
                    content["backgroundImageUrl"] = getBackgroundImage(item);
                }
                renderTemplate.call(this, content);
            } else {
                this.response.speak(response + " " + EXIT_SKILL_MESSAGE);
                this.emit(":responseReady");
            }
        }
    },
    "AMAZON.StartOverIntent": function () {
        this.emitWithState("Quiz");
    },
    "AMAZON.StopIntent": function () {
        this.response.speak(EXIT_SKILL_MESSAGE);
        this.emit(":responseReady");
    },
    "AMAZON.CancelIntent": function () {
        this.response.speak(EXIT_SKILL_MESSAGE);
        this.emit(":responseReady");
    },
    "AMAZON.HelpIntent": function () {
        this.response.speak(HELP_MESSAGE).listen(HELP_MESSAGE);
        this.emit(":responseReady");
    },
    "Unhandled": function () {
        this.emitWithState("AnswerIntent");
    },
    "AMAZON.PreviousIntent": function () {
        this.emitWithState("AnswerIntent");
    },
    "AMAZON.NextIntent": function () {
        this.emitWithState("AnswerIntent");
    }
});

//==============================================================================
//===================== Export the handler =====================================
//==============================================================================

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers, startHandlers, quizHandlers, selectQuizHandlers, describeQuizHandlers);
    alexa.execute();
};

//==============================================================================
//===================== Echo Show Helper Functions  ============================
//==============================================================================

// Help function
function getQuestion(item) {
    return item.question;
}

// Get the right answer - YES / NO QUESTIONS
function getRightAnswer(questionType) {
    switch (questionType) {
        case "YESNO":
            return "yes";
        case "NOYES":
            return "no";
        default:
            return questionType
    }
}

// Get the wrong answers - YES / NO QUESTIONS
function getWrongAnswer(questionType) {
    switch (questionType) {
        case "YESNO":
            return "no";
        case "NOYES":
            return "yes";
        default:
            return questionType
    }
}

//This is what your card title will be.  For our example, we use the name of the state the user requested.
function getCardTitle(item) {
    return item.question;
}

//This is the small version of the card image.  We use our data as the naming convention for our images so that we can dynamically
//generate the URL to the image.  The small image should be 720x400 in dimension.
function getSmallImage(item) {
    if (item.imageSmallUrl) {
        return item.imageSmallUrl;
    }
    return IMAGE_FALLBACK;
}

//This is the large version of the card image.  It should be 1200x800 pixels in dimension.
function getLargeImage(item) {
    if (item.imageSmallUrl) {
        return item.imageSmallUrl;
    }
    return IMAGE_FALLBACK;
}

// backgroundImage for Echo Show body templates
function getBackgroundImage(item) {
    if (item.imageSmallUrl) {
        return item.imageSmallUrl;
    }
    return IMAGE_FALLBACK;
}

function getSlotValues(event) {
    //are there
    let isSlot =
        event.request &&
        event.request.intent &&
        event.request.intent.slots;

    //are there tokens
    let isToken =
        event.request &&
        event.request.token;

    if (isSlot) {
        let slots = event.request.intent.slots;
        for (let slot in slots) {
            if (slots[slot].value && slots[slot].value != undefined) {
                return slots[slot].value.toString().toLowerCase();
            }
        }
    }
    if (isToken) {
        return event.request.token.toString().toLowerCase();
    }
    return "";
}

function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomSymbolSpeech(symbol) {
    return "<say-as interpret-as='spell-out'>" + symbol + "</say-as>";
}

function getSpeechCon(type) {
    if (type) {
        return speechConsCorrect[getRandom(0, speechConsCorrect.length - 1)] + "! <break strength='strong'/>";
    } else {
        return speechConsWrong[getRandom(0, speechConsWrong.length - 1)] + "! <break strength='strong'/>";
    }
}

function formatCasing(key) {
    key = key.split(/(?=[A-Z])/).join(" ");
    return key;
}

function getTextDescription(item) {
    var text = "";

    for (var key in item) {
        text += formatCasing(key) + ": " + item[key] + "\n";
    }
    return text;
}

function supportsDisplay() {
    return this.event.context &&
        this.event.context.System &&
        this.event.context.System.device &&
        this.event.context.System.device.supportedInterfaces &&
        this.event.context.System.device.supportedInterfaces.Display;
}

function isSimulator() {
    let isSimulator = !this.event.context; //simulator doesn't send context
    return false;
}

function renderTemplate(content) {
    console.log("renderTemplate" + content.templateToken);
    //learn about the various templates
    //https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/display-interface-reference#display-template-reference
    //
    let response = {};
    switch (content.templateToken) {
        case "WelcomeScreenView":
            //Send the response to Alexa
            this.context.succeed(response);
            break;
        case "FinalScoreView":
            //  "hasDisplaySpeechOutput" : response + " " + EXIT_SKILL_MESSAGE,
            //  "bodyTemplateContent" : getFinalScore(this.attributes["quizscore"], this.attributes["counter"]),
            //  "templateToken" : "FinalScoreView",
            //  "askOrTell": ":tell",
            //  "hint":"start a quiz",
            //  "sessionAttributes" : this.attributes
            //  "backgroundImageUrl"
            response = {
                "version": "1.0",
                "response": {
                    "directives": [
                        {
                            "type": "Display.RenderTemplate",
                            "backButton": "HIDDEN",
                            "template": {
                                "type": "BodyTemplate6",
                                //"title": content.bodyTemplateTitle,
                                "token": content.templateToken,
                                "textContent": {
                                    "primaryText": {
                                        "type": "RichText",
                                        "text": "<font size = '7'>" + content.bodyTemplateContent + "</font>"
                                    }
                                }
                            }
                        }, {
                            "type": "Hint",
                            "hint": {
                                "type": "PlainText",
                                "text": content.hint
                            }
                        }
                    ],
                    "outputSpeech": {
                        "type": "SSML",
                        "ssml": "<speak>" + content.hasDisplaySpeechOutput + "</speak>"
                    },
                    "reprompt": {
                        "outputSpeech": {
                            "type": "SSML",
                            "ssml": ""
                        }
                    },
                    "shouldEndSession": content.askOrTell == ":tell",

                },
                "sessionAttributes": content.sessionAttributes

            };

            if (content.backgroundImageUrl) {
                //when we have images, create a sources object

                let sources = [
                    {
                        "size": "SMALL",
                        "url": content.backgroundImageUrl
                    },
                    {
                        "size": "LARGE",
                        "url": content.backgroundImageUrl
                    }
                ];
                //add the image sources object to the response
                response["response"]["directives"][0]["template"]["backgroundImage"] = {};
                response["response"]["directives"][0]["template"]["backgroundImage"]["sources"] = sources;
            }


            //Send the response to Alexa
            this.context.succeed(response);
            break;

        case "ItemDetailsView":
            response = {
                "version": "1.0",
                "response": {
                    "directives": [
                        {
                            "type": "Display.RenderTemplate",
                            "template": {
                                "type": "BodyTemplate3",
                                "title": content.bodyTemplateTitle,
                                "token": content.templateToken,
                                "textContent": {
                                    "primaryText": {
                                        "type": "RichText",
                                        "text": "<font size = '5'>" + content.bodyTemplateContent + "</font>"
                                    }
                                },
                                "backButton": "HIDDEN"
                            }
                        }
                    ],
                    "outputSpeech": {
                        "type": "SSML",
                        "ssml": "<speak>" + content.hasDisplaySpeechOutput + "</speak>"
                    },
                    "reprompt": {
                        "outputSpeech": {
                            "type": "SSML",
                            "ssml": "<speak>" + content.hasDisplayRepromptText + "</speak>"
                        }
                    },
                    "shouldEndSession": content.askOrTell == ":tell",
                    "card": {
                        "type": "Simple",
                        "title": content.simpleCardTitle,
                        "content": content.simpleCardContent
                    }
                },
                "sessionAttributes": content.sessionAttributes

            };

            if (content.imageSmallUrl && content.imageLargeUrl) {
                //when we have images, create a sources object
                //TODO switch template to one without picture?
                let sources = [
                    {
                        "size": "SMALL",
                        "url": content.imageSmallUrl
                    },
                    {
                        "size": "LARGE",
                        "url": content.imageLargeUrl
                    }
                ];
                //add the image sources object to the response
                response["response"]["directives"][0]["template"]["image"] = {};
                response["response"]["directives"][0]["template"]["image"]["sources"] = sources;
            }
            //Send the response to Alexa
            console.log("ready to respond (ItemDetailsView): " + JSON.stringify(response));
            this.context.succeed(response);
            break;

        case "MultipleChoiceListView":
            console.log("listItems " + JSON.stringify(content.listItems));
            response = {
                "version": "1.0",
                "response": {
                    "directives": [
                        {
                            "type": "Display.RenderTemplate",
                            "template": {
                                "type": "ListTemplate1",
                                "title": content.listTemplateTitle,
                                "token": content.templateToken,
                                "listItems": content.listItems,
                                "backgroundImage": {
                                    "sources": [
                                        {
                                            "size": "SMALL",
                                            "url": content.backgroundImageSmallUrl
                                        },
                                        {
                                            "size": "LARGE",
                                            "url": content.backgroundImageLargeUrl
                                        }
                                    ]
                                },
                                "backButton": "HIDDEN"
                            }
                        }
                    ],
                    "outputSpeech": {
                        "type": "SSML",
                        "ssml": "<speak>" + content.hasDisplaySpeechOutput + "</speak>"
                    },
                    "reprompt": {
                        "outputSpeech": {
                            "type": "SSML",
                            "ssml": "<speak>" + content.hasDisplayRepromptText + "</speak>"
                        }
                    },
                    "shouldEndSession": content.askOrTell === ":tell",
                    "card": {
                        "type": "Simple",
                        "title": content.simpleCardTitle,
                        "content": content.simpleCardContent
                    }
                },
                "sessionAttributes": content.sessionAttributes

            };

            if (content.backgroundImageLargeUrl) {
                //when we have images, create a sources object
                //TODO switch template to one without picture?
                let sources = [
                    {
                        "size": "SMALL",
                        "url": content.backgroundImageLargeUrl
                    },
                    {
                        "size": "LARGE",
                        "url": content.backgroundImageLargeUrl
                    }
                ];
                //add the image sources object to the response
                response["response"]["directives"][0]["template"]["backgroundImage"] = {};
                response["response"]["directives"][0]["template"]["backgroundImage"]["sources"] = sources;
            }
            console.log("ready to respond (MultipleChoiceList): " + JSON.stringify(response));
            this.context.succeed(response);
            break;
        case "SelectListView":
            console.log("listItems " + JSON.stringify(content.listItems));
            response = {
                "version": "1.0",
                "response": {
                    "directives": [
                        {
                            "type": "Display.RenderTemplate",
                            "template": {
                                "type": "ListTemplate2",
                                "title": content.listTemplateTitle,
                                "token": content.templateToken,
                                "listItems": content.listItems,
                                "backgroundImage": {
                                    "sources": [
                                        {
                                            "size": "SMALL",
                                            "url": content.backgroundImageSmallUrl
                                        },
                                        {
                                            "size": "LARGE",
                                            "url": content.backgroundImageLargeUrl
                                        }
                                    ]
                                },
                                "backButton": "HIDDEN"
                            }
                        }
                    ],
                    "outputSpeech": {
                        "type": "SSML",
                        "ssml": "<speak>" + content.hasDisplaySpeechOutput + "</speak>"
                    },
                    "reprompt": {
                        "outputSpeech": {
                            "type": "SSML",
                            "ssml": "<speak>" + content.hasDisplayRepromptText + "</speak>"
                        }
                    },
                    "shouldEndSession": content.askOrTell === ":tell",
                    "card": {
                        "type": "Simple",
                        "title": content.simpleCardTitle,
                        "content": content.simpleCardContent
                    }
                },
                "sessionAttributes": content.sessionAttributes

            };

            if (content.backgroundImageLargeUrl) {
                //when we have images, create a sources object
                //TODO switch template to one without picture?
                let sources = [
                    {
                        "size": "SMALL",
                        "url": content.backgroundImageLargeUrl
                    },
                    {
                        "size": "LARGE",
                        "url": content.backgroundImageLargeUrl
                    }
                ];
                //add the image sources object to the response
                response["response"]["directives"][0]["template"]["backgroundImage"] = {};
                response["response"]["directives"][0]["template"]["backgroundImage"]["sources"] = sources;
            }
            console.log("ready to respond (MultipleChoiceList): " + JSON.stringify(response));
            this.context.succeed(response);
            break;
        case "DescribeView":
            console.log("listItems " + JSON.stringify(content.listItems));
            response = {
                "version": "1.0",
                "response": {
                    "directives": [
                        {
                            "type": "Display.RenderTemplate",
                            "template": {
                                "type": "BodyTemplate7",
                                "title": content.listTemplateTitle,
                                "image": content.image,
                                "backButton": "HIDDEN"
                            }
                        }
                    ],
                    "outputSpeech": {
                        "type": "SSML",
                        "ssml": "<speak>" + content.hasDisplaySpeechOutput + "</speak>"
                    },
                    "reprompt": {
                        "outputSpeech": {
                            "type": "SSML",
                            "ssml": "<speak>" + content.hasDisplayRepromptText + "</speak>"
                        }
                    },
                    "shouldEndSession": content.askOrTell === ":tell",
                    "card": {
                        "type": "Simple",
                        "title": content.simpleCardTitle,
                        "content": content.simpleCardContent
                    }
                },
                "sessionAttributes": content.sessionAttributes
            };

            if (content.backgroundImageLargeUrl) {
                //when we have images, create a sources object
                //TODO switch template to one without picture?
                let sources = [
                    {
                        "size": "SMALL",
                        "url": content.backgroundImageLargeUrl
                    },
                    {
                        "size": "LARGE",
                        "url": content.backgroundImageLargeUrl
                    }
                ];
                //add the image sources object to the response
                response["response"]["directives"][0]["template"]["backgroundImage"] = {};
                response["response"]["directives"][0]["template"]["backgroundImage"]["sources"] = sources;
            }
            console.log("ready to respond (MultipleChoiceList): " + JSON.stringify(response));
            this.context.succeed(response);
            break;
        default:
            this.response.speak("Thanks for playing, goodbye");
            this.emit(':responseReady');
    }
}