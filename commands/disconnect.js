const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('disconnect')
		.setDescription('Disconnects the bot from the voice channel'),
	async execute(interaction) {
		const connection = getVoiceConnection(interaction.guildId);
        connection.destroy();
        interaction.reply('Hasta luego :)');
	},
};