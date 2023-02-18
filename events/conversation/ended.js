const { createReadStream } = require('node:fs');
const { getVoiceConnection, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const { join } = require('node:path');

module.exports = {
	name: 'ended',
	execute(error, continueConversation, client) {
		if (error) throw new Error(error);

		if (client.assistantManager.textMode) {
			client.assistantManager.waitingForTextQuery = continueConversation;
			return client.assistantManager.textMode = false;
		}

		client.assistantManager.waitingForQuery = continueConversation;
		console.log("Esperando respuesta: "+continueConversation);
		if (client.assistantManager.outputFileStream) {
			client.assistantManager.outputFileStream.end();
			client.assistantManager.startRecording = true;

			const connection = getVoiceConnection(client.msg.channel.guild.id);
			const player = createAudioPlayer();

			const response = createAudioResource(createReadStream(join('./resources/', 'answer.wav')));
			connection.subscribe(player);
			player.play(response);
		}
	},
};