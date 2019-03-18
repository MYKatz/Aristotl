const dialogflow = require('dialogflow');
require('dotenv').config();
const LANGUAGE_CODE = 'en-US' 
//console.log(process.env.DLF_PKEY);

class DialogFlow {
	constructor (projectId) {
		this.projectId = projectId;

		let privateKey = process.env.DLF_PKEY; //(process.env.NODE_ENV=="production") ? JSON.parse(process.env.DLF_PKEY) : process.env.DLF_PKEY;
        let clientEmail = process.env.DLF_EMAIL;
		let config = {
			credentials: {
				private_key: privateKey,
				client_email: clientEmail
			}
		}
	
		this.sessionClient = new dialogflow.SessionsClient(config)
	}

	async sendTextMessageToDialogFlow(textMessage, sessionId) {
		// Define session path
		const sessionPath = this.sessionClient.sessionPath(this.projectId, sessionId);
		// The text query request.
		const request = {
			session: sessionPath,
			queryInput: {
				text: {
					text: textMessage,
					languageCode: LANGUAGE_CODE
				}
			}
		}
		try {
			let responses = await this.sessionClient.detectIntent(request)			
            console.log('DialogFlow.sendTextMessageToDialogFlow: Detected intent');
            console.log(responses[0].queryResult.fulfillmentText);
			return responses
		}
		catch(err) {
			console.error('DialogFlow.sendTextMessageToDialogFlow ERROR:', err);
			throw err
		}
	}
}

var df = new DialogFlow("newagent-e0a57");




function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
async function demo() {
    df.sendTextMessageToDialogFlow("Hey I need help with some macro", "rand0l");
    await sleep(2000);
    var l = await df.sendTextMessageToDialogFlow("Yes.", "rand0l");
    console.log(l[0].queryResult.outputContexts[0].parameters.fields.problem_subject);
  }
  
demo();
