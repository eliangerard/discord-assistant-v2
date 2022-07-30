const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('query')
		.setDescription('Consult anything with the google assistant')
        .addStringOption(option => option.setName('query').setDescription('What you want to consult').setRequired(true)),
	async execute(interaction, client) {
		const user = interaction.user.username + interaction.user.discriminator;
		if(client.assistantManager.waitingForTextQuery && client.assistantManager.waitingForTextUser != user)
		return interaction.reply({ content: 'Estoy esperando la respuesta de alguién más :)', ephemeral: true});
		
		await interaction.deferReply();
        client.assistantManager.textMode = true;
		client.assistantManager.waitingForTextUser = user;
		client.interaction = await interaction;

		client.executeQuery(interaction.options.getString('query'));
	},
};