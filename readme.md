# TECH CHALLENGE - Apoplex

http://techchallenge.de/

# INTRODUCTION

Three hours. That is the time you have to get help, 
if you just suffered a stroke. However, 
only 20% of the people reach the hospital in time. 
The consequences of being late can be remaining brain damages or even death.
We couldn't accept this low rate of 20% and thought of a potential solution. 

Apoplex is an Alexa skill that helps with the recognition of 
early-warning symptoms of strokes. 
Early recognition of stroke symptoms is crucial in order to seek 
help and undergo therapy as fast as possible. 

The Apoplex skill was programmed in NodeJS, 
runs on the Amazon Echo Show device and uses the AWS Lambda 
and DynamoDB services. 

# THINGS USED IN THIS PROJECT

* Amazon Alexa
* Echo Show
* Alexa Skill Builder
* AWS Lambda
* AWS Dynamo DB
* AWS S3
* AWS CLI
* NodeJS
* Sample NodeJS Quiz Game 

(Github Link: https://github.com/alexa/skill-sample-nodejs-quiz-game)


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

Alexa: "What object can you see in the photo?"

Echo Show shows a photo of a hammer

User: "Hammer"

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

# Todo

* Multi Lang
* Emergency Interaction (call emergency, call relative, ...)

# Team 

Martin Schleich    

Jasmin-Chiara  Bauer

Yasmin El Khodary

Sebastian Erhardt 

