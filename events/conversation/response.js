module.exports = {
	name: 'response',
	async execute(text, client) {
		console.log(text);
		if(client.assistantManager.textMode){
			client.interaction.editReply(text);
		}
	},
};