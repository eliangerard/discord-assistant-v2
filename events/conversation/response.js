module.exports = {
	name: 'response',
	async execute(text, client) {
		if(client.assistantManager.textMode){
			client.interaction.editReply(text);
		}
	},
};