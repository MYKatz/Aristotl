For the Oktane19 global hackathon. Check out my devpost posting [here](https://devpost.com/software/aristotl)

## Inspiration & Business Value

When conversing in group chats with other students, I noticed that many people often posted homework problems that they needed help with. However, often times their questions went unanswered, or the answers they got were unhelpful. That lead me to the idea of a more "conversational" academic assistance service - a platform on which students can easily ask bite-sized questions and instantaneously receive answers.

I was inspired by HackHands (acquired by Pluralsight in 2015) and CodeMentor (which has raised $3.4M to date), both services that introduced this model to the programming community. I thought that the same model could be applied to other subjects, and so I created Aristotl.

Note that while the web app is primarily targeted towards students for now, it could very easily be converted to instead be a platform for technical support, or for job training questions, etc. The sky's the limit! 

## What it does

(Check out the demo video above!! :) )

A student, needing help with a question, registers for Aristotl - either with an email/pass or with a Google/Facebook account. After entering their information and purchasing credits (for now, just a proof-of-concept - no payment necessary!), the user can converse with an intelligent chatbot that will diagnose their problem. The chatbot can generally determine the subject without being told specifically what it is; ie if a user inputs "I can't do this integral" it'll correctly classify it as a calculus problem. After conversing with the chatbot the user is directed to upload an image of their problem, then is redirected into a private room.

The "tutor" can then enter the private room and converse in real time with the "student". To help illustrate certain concepts, the teacher & student can draw on a collaborative whiteboard component, which updates in real time using websockets. If necessary, either the student or the teacher can initiate a video call with the student by pressing the camera icon.

There are a few more features under-the-hood... here's a full list:

## Features

- Real-time chat with websockets
- Real-time 'whiteboard' component that teachers can use
- User can edit data such as gradelevel/biography/account type for better classification
- Separate dashboards and user types (one for students, one for teachers)
- Students initialize their problem by conversing with an intelligent chatbot
- Chatbot uses NLP (Google Dialogflow) to determine intent and subject of the problem
- Sentiment analysis using the VADER model
- Emoji picker for user-to-user chatrooms  (:D)
- Credits system (perhaps some business viability there... but just a proof-of-concept for now)
- History + auto-saving feature, allowing students to re-open their issue if need be
- Image uploads + storage w/ GRIDFS
- SMS updates for students when they're offline but their question receives a response 
- Optional Audio/Video calls - with a cool draggable container! (check out the demo video)

## Integrations

### Okta

This was my first time using any of Okta's tools - but it won't be the last! Working with Okta's libraries was amazing, and it saved me the headache of having to implement auth using something like passport. Thanks Okta!

These were the Okta features I used:

- Basic email/password authentication
- Social authentication providers (I used Google and FB)
- Multi-Factor Authentication with SMS
- Self-service registration
- Custom login page (background & logo)
- Custom attributes and scopes (these were super helpful once I got them to work. I'm proud to say that all of Aristotl's **user data** is stored within Okta - no external database needed!)
- Other standard but cool features of the React library or the Node.js SDK: protected routes, verifying requests, verifying websocket connections, etc.

### Twilio

This was _not_ the first time I used twilio, and so it was great to get the update that twilio joined in as a sponsor for this hackathon! Thanks Twilio for the credits and for your awesome APIs!

In this project, twilio was used in two ways:

- Programmable SMS for the alerts to inactive users
- Programmable Video for the audio/video conferencing option

## How I built it

This was built using the MERN stack - Mongo, Express, React, Node.js. As mentioned earlier, all userdata is stored in Okta, Mongo is only used to store each problem's information. Websockets were used to implement real-time communication between users, and Dialogflow powers the chatbot.

## Challenges I ran into

This was the first time I've used react to build a full web app, so everything to do with that required some learning.

## Accomplishments that I'm proud of

Finishing in time :)

## What I learned

A lot about React.js and related stuff.

Also, I learned that Okta is pretty cool! Definitely a time/energy saver for future hackathons, and it was a blast figuring out all the neat things that Okta can do out-of-the-box.

## What's next for Aristotl

Who knows? I'll try to do some validation to see if this is something that people will actually want/use, and if that results in positive feedback I'll do some more work on the UI and functionality and perhaps launch it. As I noted earlier, I'm not super certain that students are the best target market for this, so I'll also see if there's a better niche that I can serve with Aristotl!