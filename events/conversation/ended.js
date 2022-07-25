const { createReadStream } = require('node:fs');
const { getVoiceConnection, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const { join } = require('node:path');

module.exports = {
	name: 'ended',
	execute(error, continueConversation, client) {
		if(error) throw new Error(error);
		client.assistantManager.waitingForQuery = continueConversation;

		if(client.assistantManager.textMode)
			return client.assistantManager.textMode = continueConversation;

		client.assistantManager.outputFileStream.end();
		client.assistantManager.startRecording = true;
		
		const connection = getVoiceConnection(client.msg.channel.guild.id);
		const player = createAudioPlayer();
        
        const response = createAudioResource(createReadStream(join('./resources/', 'answer.wav')));
		connection.subscribe(player);
		player.play(response);
	},
};