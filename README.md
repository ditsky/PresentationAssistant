# PresentationAssistant
You must download and run this app on your computer in order to use SpeechFlow to Control your presentations
[link to SpeechFlow github](https://github.com/ditsky/SpeechFlow)

This app recieves http requests from the [speechflow webhook](https://https://speechflow.herokuapp.com) hosted on heroku in order to send keys to your computer which you specify from speaking to the SpeechFlow bot hosted on the google assistant (not yet publicly released).

In order to use our app right now, you need to have nodejs and mongo installed on your computer. First open a terminal and run the command mongod, to start a local database. Then, clone the repository and use another terminal window to cd to the PresentationAssistant repository and run the command npm start. The app should automatically open a browser tab with the app running on your computer.

Once the app is running, you should be greeted by this home page:
![Home Page](ditsky.github.com/PresentationAssistant/images/SpeechFlowGUI.jpeg)

Every time you launch our app, you have to create a connection from your phone to your laptop.
So, open the google assistant on your phone and say "Talk to speech flow"
The assistant should then connect you to our dialogflow bot, and the first command you should always give is "connect"
The bot should return a unique code for you to type into the webapp on your computer. This code is unique to your google userid, so if you are a returning user and remember the code, or your browser saves the code, you can enter the code as soon as you open the app, without asking the google assistant to connect you. 

In order to enter the code, click the "enter your code" button on the home page and submit your code in the user code form.
The page should then display "You are Connected" if the connection was successful. 
![Code Page](ditsky.github.com/PresentationAssistant/images/SpeechFlowCode.jpeg)

After connecting, you should be able to give commands to your computer through the phone from any of our current functions:

Command | Response
------------ | -------------
"next"| Presses the down arrow
"back" | Presses the up arrow
"go to slide (slide number)" | Enters the number given and then the enter key
"pause" or "play" | Presses the space bar
"end/exit presentation" | Presses the escape key
"random student" | Selects a random student from your class
"open the (name) link | Opens a link from the name you specify

# Using lecture materials and students
You can go the page to add links and students to your lesson with the "Lesson Materials" button on the top right of the screen.
On this screen displays every student and link in your database, along with a form to add students and/or links to the database. Your database will be stored inbetween uses of the app.
![Materials Page](ditsky.github.com/PresentationAssistant/images/SpeechFlowMaterials.jpeg)







