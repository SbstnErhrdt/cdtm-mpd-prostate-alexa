# CDTM MPD Prostate Alexa Skill

Welcome to the CDTM MDP PROSTATE - Prostate / Procare Alexa Skill code repository.

This Code was written in the context of the Managing Product Development Course at the Center for Digital Technology and Management. 

## Disclaimer
This is a prototype. Do not use it in a production setting!
This project gives an outlook what you could do. It was not meant to run anywhere in production.

## Abstract 
Cancer is a widespread disease in modern world. 
Prostate cancer is a cancer type which affects only men and the onset happens around the age of 65 in majority of the cases. 
This disease accompanies a wide array of symptoms which are often not reported routinely due to multitude of reasons. 
Studies have found that routine reporting of symptoms leads to several clinical benefits in terms of combating the disease progression. 
Procare is a solution aimed at connecting the patient with the doctor digitally in order to enable the doctor to more easily keep track of the disease progression in the patient and take preventive measures to prolong the patients life expectancy. 
It is a digital ecosystem which offers facilities of symptom reporting, medication tracking, a knowledge network, and a chat feature for the patient to talk with the doctor. 
A patient can interact with the ecosystem easily using the web/mobile interface or smart devices such as Amazon Alexa or Amazon IoT Button.

# Team

* Saad
* Ibrar
* Afrida
* Sebastian

# Project Description
Another interface to the procare ecosystem is the voice interface. 
At the moment there are multiple player on the market. 
Apple is offering the Siri voice assistant, 
Google is offering its “OK Google” and Amazon is offering Alexa. 

We here also decided to build something on prior knowledge. 
A team member participated in the TUM Tech Challenge and developed 
an application for stroke patients. 
We decided to reuse the code and adapt it to the procare use case.

This repository was developed in JavaScript At the beginning this 
app was based on the Amazon Sample Quiz. 

There is a framework called serverless, 
it is at the moment the most widely-adopted toolkit for building 
serverless applications. (https://serverless.com/) 
It works on any major cloud computing platform available.

We used the serverless framework to deploy the Node JS application to 
AWS Lambda. 

Then the Alexa Ecosystem was configured via the Alexa Developer 
Console (https://developer.amazon.com/alexa/console/)  


# Frameworks

The following frameworks / libraries, products and repositories were used in the process and the final voice interface.

* NodeJS (https://nodejs.org/en/) 
* Serverless (https://serverless.com/) 
* Amazon Alexa (https://developer.amazon.com/de/alexa) 
* Amazon Alexa Developer Console (https://developer.amazon.com/alexa/console/)
* Echo Show (https://amzn.to/2Ehq8R9) 
* Alexa Skill Builder (https://developer.amazon.com/de/alexa-skills-kit/guides) 
* AWS Lambda (https://aws.amazon.com/de/lambda/) 
* AWS Dynamo DB (https://aws.amazon.com/de/dynamodb/)
* AWS S3 (https://aws.amazon.com/de/s3/) 
* AWS CLI (https://aws.amazon.com/de/cli/) 
* Sample NodeJS Quiz Game (https://github.com/alexa/skill-sample-nodejs-quiz-game) 


# THINGS NEEDED FOP THE PROJECT

* Echo Show
* AWS Account
* Amazon Developer Account

## Echo Show

Buy it via Amazon 
http://amzn.to/2DOh0G6

## Amazon AWS Account
Register on 
https://aws.amazon.com

## Amazon Developer Account
Register on 
https://developer.amazon.com/de/

# RESOURCES

* https://developer.amazon.com/de/documentation
* https://developer.amazon.com/alexacreator/
* https://aws.amazon.com/de/cli/
* https://github.com/alexa/skill-sample-nodejs-quiz-game

## Questionnaire
The user has to answer the predefined questions in the 
`questions/questions-questionnaire.json` with either YES or NO.

### Example dialogue:

TODO

Alexa: "Do you have a headache?"

Echo Show shows the question an the possible answers

User: Touches on YES button on the screen or says "YES" 


## Select Photos
The user has to select the right image out of 4 images 
via the Echo Show touch display. The question sequence can be found in the
`questions/questions-select.json` file. The photos can be found in the `assets folder.

### Example dialogue:

Alexa: "What photo represents a cat?"

Echo Show shows 4 photos. Dog, Cat, Mouse, Bird

User: Touches on cat photo on the screen 

## Describe Photos
The user has to describe in a word what he or she sees on the display. 
The question sequence can be found in the
`questions/questions-select.json` file.
The photos can be found in the `assets`

### Example dialogue:

Alexa: "Do you have pain in your back?"

User: "Yes"

# VRIABLES

There are the following variables to control the skill.

```
Threshold of the max wrong answers
If there are more wrong answers than the threshold the call a doctor
EMERGENCY_QUESTION_THRESHOLD
EMERGENCY_SELECT_THRESHOLD
EMERGENCY_DESCRIBE_THRESHOLD
EMERGENCY_UNDERSTANDING_THRESHOLD
```
```
How many questions of the questionnaire should be asked
MAX_QUESTIONS 
```
```
How many image select questions should be asked
MAX_SELECT_QUESTIONS
```
```
How many image describe questions should be asked
MAX_DESCRIBE_QUESTIONS
```
```
This is the welcome message for when a user starts the skill without a specific in
WELCOME_MESSAGE
```
```
This is the message a user will hear when they start a quiz.
START_QUIZ_MESSAGE 
```
```
This is the message a user will hear when they are in the select section of the sk
START_QUIZ_SELECT_MESSAGE 
```
```
This is the message a user will hear when they are in the describe section of the 
START_QUIZ_DESCRIBE_MESSAGE
```
```
The user will hear the emergency understanding message if they have said not yes o
EMERGENCY_UNDERSTANDING_MESSAGE
```
```
This is the message a user will hear when they try to cancel or stop the skill, or
EXIT_SKILL_MESSAGE 
```
```
This is the message a user will hear after they ask (and hear) about a specific da
REPROMPT_SPEECH
```
```
This is the message a user will hear when they ask Alexa for help in your skill.
HELP_MESSAGE 
```
```
Background image fallback
IMAGE_FALLBACK
```


#Deploy to AWS Lambda
Works with AWS CLI

```
sh publish.sh
```


#Images
The following images have been used in the application.

```
https://stocksnap.io/search/microphone
https://stocksnap.io/photo/R8SYL6ROA1
```

# Set up

1. To install the alexa endpoint you need to have an Amazon Developer Account. 

2. Go to the Amazon Developer Portal (https://developer.amazon.com/de/).  In the top-right corner of the screen, click the "Sign In" button. (If you don't already have an account, you will be able to create a new one for free.)


3. Once you have signed in, move your mouse over the Your Alexa Consoles text at the top of the screen and Select the Skills (New) Link.


4. From the Alexa Skills Console (New Console) select the Create Skill button near the top of the screen.


5. Give your new skill a Name. This is the name that will be shown in the Alexa Skills Store, and the name your users will refer to. 


6. Clone the Git Repository (https://github.com/SbstnErhrdt/cdtm-mpd-prostate-alexa). You can do that by executing the following command on your system in the Terminal / Command Line Interface
`$ git clone https://github.com/SbstnErhrdt/cdtm-mpd-prostate-alexa` \
Make sure you have installed nodejs and the node package manager. 
See frontend installation: \
You have to install NodeJS on your system.\
Go to the node website (https://nodejs.org/en/) and download the latest version and install it.\
By default it should also install the Node Package Manager (NPM)

7. Install the necessary dependencies of the application. Go to the root folder of the app and execute the following command.
`$ npm install`

8. Follow the serverless guide with regards to Amazon Web Services:
https://serverless.com/framework/docs/providers/aws/guide/credentials/  


9. Deploy the skill by executing \
`$ sls deploy production` \
You will get an URL of the endpoint. Save the url you will need it in step 13.


10. Keep the default Custom model selected in the Alexa Skill Developer Console, and scroll the page down.


11. Choose Alexa-Hosted for the method to host your skill's backend resources. Scroll backup and select the Create Skill button at the top right. It will take a minute to create your Alexa hosted skill, then you will be taken to the Build tab of the console.


12. Build the Interaction Model for your skill
On the left hand navigation panel. Select the Invocation tab. Enter a Skill Invocation Name. This is the name that your users will need to say to start your skill.
Next, select the JSON Editor tab. In the textfield provided, replace any existing code with the code provided in the Interaction Model (make sure to pick the model that matches your skill's language), then click "Build Model".


13. Connect the lambda function that you have deployed with the serverless framework. You just copy the URL to the specific field in the console.


14. Note: You should notice that Intents and Slot Types will auto populate based on the JSON Interaction Model that you have now applied to your skill. Feel free to explore the changes here, to learn about Intents, Slots, and Utterancesopen our technical documentation in a new tab.


15. Optional: Select an intent by expanding the Intents from the left side navigation panel. Add some more sample utterances for your newly generated intents. Think of all the different ways that a user could request to make a specific intent happen. A few examples are provided. Be sure to click Save Model and Build Model after you're done making changes here.


16. If your interaction model builds successfully, proceed to the next step. If not, you should see an error. Try to resolve the errors. In our next step of this guide, we will be creating our code.


17. If you get an error from your interaction model, check through this list:
Did you copy & paste the provided code correctly?
Did you accidentally add any characters to the Interaction Model or Sample Utterances?

Partly from the sample quiz which was referred earlier (https://github.com/alexa/skill-sample-nodejs-quiz-game)  and from the Build An Alexa Quiz Game Skill site (https://github.com/alexa/skill-sample-nodejs-quiz-game) 

# Codebase

This repository simply consists of:
The main entry point where the logic of the app is handled 

`Index.js`


and another file where the questions and the question type is stored. 

`questions/questions-questionnaire.json`

The `package.json` includes all necessary modules to build the application
