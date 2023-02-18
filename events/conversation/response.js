module.exports = {
	name: 'response',
	async execute(text, client) {
		if(client.assistantManager.textMode){
			if (text.length == 0 || text == "") return client.interaction.editReply("No tengo una respuesta textual para eso, prueba en un canal de voz");
			client.interaction.editReply(text);
		}
	},
};