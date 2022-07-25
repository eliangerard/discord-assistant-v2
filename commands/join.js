const { createReadStream } = require('node:fs');
const { join } = require('node:path');
const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, StreamType } = require('@discordjs/voice');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('Join the bot to the voice channel'),
	async execute(interaction) {
        const player = createAudioPlayer();
        const resJoin = createAudioResource(createReadStream(join('./resources/', 'join.ogg'), {
            inputType: StreamType.OggOpus,
        }));
        
        const connection = joinVoiceChannel({
	        channelId: interaction.member.voice.channelId,
	        guildId: interaction.guildId,
	        adapterCreator: interaction.guild.voiceAdapterCreator,
            selfDeaf:false
        });

        connection.subscribe(player);
        player.play(resJoin);

        player.on('error', error => {
            console.error('Error:', error.message);
        });

		await interaction.reply('Listo para escucharte :)');
	},
};