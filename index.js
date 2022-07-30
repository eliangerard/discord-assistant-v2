const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const GoogleAssistant = require('google-assistant');
const { addSpeechEvent } = require("discord-speech-recognition");

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });
client.config = require("./config.json");
client.interaction = null;

client.assistantManager = {
    textMode : false,
    waitingForQuery : false,
    waitingForTextQuery : false,
    waitingForUser : null,
    waitingForTextUser : null,
    startRecording : true,
    outputFileStream : null
};

client.config.assistant = {
    auth: {
      keyFilePath: path.resolve(__dirname, client.config.client_key),
      savedTokensPath: path.resolve(__dirname, './keys/tokens.json'),
    },
    conversation: {
        lang: client.config.language,
        deviceLocation: {
            coordinates: {
                latitude: client.config.latitude,
                longitude: client.config.longitude,
            }
        }
    }
};

addSpeechEvent(client, { lang: client.config.language });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

commandFiles.forEach(file => {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
});

const eventsPath = path.join(__dirname, 'events/discord');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

eventFiles.forEach(file => {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name,(...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
});

const conversationEventsPath = path.join(__dirname, 'events/conversation');
const conversationEventFiles = fs.readdirSync(conversationEventsPath).filter(file => file.endsWith('.js'));

const startConversation = conversation => {
    conversationEventFiles.forEach(file => {
        const filePath = path.join(conversationEventsPath, file);
        const event = require(filePath);
        conversation.on(event.name, (...args) => {
            event.execute(...args, client)
        });
    });
}

client.executeQuery = (query) => {
    client.config.assistant.conversation.textQuery = query;
    client.assistant.start(client.config.assistant.conversation, startConversation);
}

client.assistant = new GoogleAssistant(client.config.assistant.auth);

client.assistant
.on('ready', () => {
    console.log("Assistant instance is ready, starting bot");
    client.login(client.config.token);
})
.on('error', (error) => console.log('Assistant Error:', error) );

