const WavFileWriter = require('wav').FileWriter;

 

module.exports = {
	name: 'audio-data',
	execute(buffer, client) {
		if(client.assistantManager.textMode)
			return;
		if(client.assistantManager.startRecording){
			client.assistantManager.outputFileStream = new WavFileWriter(`./resources/answer.wav`, {
				sampleRate: 24000,
				bitDepth: 16,
				channels: 1
			  });
			  client.assistantManager.startRecording = false;
		}          
		client.assistantManager.outputFileStream.write(buffer);
	},
};