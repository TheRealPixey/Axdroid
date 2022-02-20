const { LieSwatter } = require('weky');
const Discord = require('discord.js');
module.exports = {
	name: "tol",
    description: "A game where you have to see if it's a truth or lie!",
    guildOnly: false,
    cooldown: 5,
    async execute(message) {
    await LieSwatter({
	message: message,
	embed: {
		title: 'Lie Swatter',
		color: '#7289da',
		timestamp: true,
	},
	thinkMessage: 'I\'m thinking',
	winMessage:
		'Nice! It was a **{{answer}}**. You got it correct in **{{time}}**.',
	loseMessage: 'Better luck next time! It was a **{{answer}}**.',
	othersMessage: 'Only <@{{author}}> can use the buttons!',
	buttons: { true: 'Truth', lie: 'Lie' },
});
    }
    }
