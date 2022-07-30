const { createReadStream } = require('node:fs');
const { join } = require('node:path');
const { getVoiceConnection, createAudioPlayer, createAudioResource, StreamType } = require('@discordjs/voice');

module.exports = {
	name: 'speech',
	once: false,
	execute(msg, client) {
        if (!msg.content || client.assistantManager.textMode) return;
        const user = msg.author.username + msg.author.discriminator;
        client.msg = msg;

        if(client.assistantManager.waitingForQuery && client.assistantManager.waitingForUser == user){
            const query = msg.content;
            return client.executeQuery(query);
        }
        if(client.assistantManager.waitingForQuery && client.assistantManager.waitingForUser != user) return;        

        const wakeUp = client.config.wake_up_phrases.split('-');
        if(!wakeUp.includes(msg.content.toLowerCase())) 
            return;
        
        client.assistantManager.waitingForUser = user;
        client.assistantManager.waitingForQuery = true;
        const connection = getVoiceConnection(msg.channel.guildId);
        const player = createAudioPlayer();
        
        const resListening = createAudioResource(createReadStream(join('./resources/', 'listening.ogg'), {
            inputType: StreamType.OggOpus,
        }));

        connection.subscribe(player);
        player.play(resListening);

        /*if(!client.assistantManager.waitingForQuery){
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
        
        
        client.msg = msg;
        client.assistantManager.waitingForQuery = true;
        */
	},
};