const { createReadStream } = require('node:fs');
const { join } = require('node:path');
const { getVoiceConnection, createAudioPlayer, createAudioResource, StreamType } = require('@discordjs/voice');

module.exports = {
	name: 'speech',
	once: false,
	execute(msg, client) {
		console.log(msg.content);
        console.log(client.assistantManager);
        if (!msg.content) return;
        if(!client.assistantManager.waitingForQuery){
            const wakeUp = client.config.wake_up_phrases.split('-');
            if(!wakeUp.includes(msg.content.toLowerCase()) && !client.waitingForQuery) return;
            
            if(!client.assistantManager.waitingForQuery)
               client.assistantManager.waitingForUser = msg.author.username+msg.author.discriminator;
        }
        const connection = getVoiceConnection(msg.channel.guild.id);
        const player = createAudioPlayer();
        
        const resListening = createAudioResource(createReadStream(join('./resources/', 'listening.ogg'), {
            inputType: StreamType.OggOpus,
        }));

        if(client.assistantManager.waitingForQuery && client.assistantManager.waitingForUser == (msg.author.username+msg.author.discriminator)){
            const query = msg.content;
            client.executeQuery(query);
            return client.assistantManager.waitingForQuery = true;
        }
        
        connection.subscribe(player);
        player.play(resListening);
        client.msg = msg;
        client.assistantManager.waitingForQuery = true;
	},
};