const { NeverHaveIEver } = require('weky');
const Discord = require('discord.js');
module.exports = {
	name: "nhie",
    description: "Never have I ever...",
    guildOnly: false,
    cooldown: 5,
    async execute(message) {
    await NeverHaveIEver({
	message: message,
	embed: {
		title: 'Never Have I Ever',
		color: '#7289da',
		timestamp: true,
	},
	thinkMessage: 'I am thinking',
	othersMessage: 'Only <@{{author}}> can use the buttons!',
	buttons: { optionA: 'Yes', optionB: 'No' },
});
    }
    }