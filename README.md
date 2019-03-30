Fill this in later


## Inspiration & Business Value

- Private teaching industry is huge (get stats)
- Saw from my own experiences that students generally wanted to seek out more informal, conversational ways of getting help (ie discord chatrooms etc)
- Kind of 'open sourcing' the learning process and help people explain concepts to others
- Inspired by companies that have applied this business model to programming, such as Hackhands (acquired by Pluralsight) and Codementor (raised $3.4M in their seed + series A rounds)

## What it does

## Functionality

## Features

- Real-time scalable chat with websockets
- Also a real-time 'whiteboard' component that teachers can use
- User can edit data such as gradelevel/biography/account type for better classification
- Separate dashboards and user types (one for students, one for teachers)
- Students initialize their problem by conversing with an intelligent chatbot
- Chatbot uses NLP (Google Dialogflow) to determine intent and subject of the problem
- Emoji picker for user-to-user chatrooms  (:D)
- Sentiment analysis using the VADER model
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

