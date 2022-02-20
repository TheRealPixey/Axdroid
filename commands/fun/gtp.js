const { GuessThePokemon } = require('weky');
const Discord = require('discord.js');
module.exports = {
	name: "gtp",
    description: "Lets you guess the Pokemon!",
    guildOnly: false,
    cooldown: 5,
    async execute(message) {
    await GuessThePokemon({
	message: message,
	embed: {
		title: 'Guess The Pokémon',
		description:
			'**Type:**\n{{type}}\n\n**Abilities:**\n{{abilities}}\n\nYou only have **{{time}}** to guess the pokémon.',
		color: '#7289da',
		timestamp: true,
	},
	thinkMessage: 'I\'m thinking...',
	othersMessage: 'Only <@{{author}}> can use the buttons!',
	winMessage:
		'Nice! It was a **{{answer}}**. You got it correct in **{{time}}**.',
	loseMessage: 'Better luck next time! It was a **{{answer}}**.',
	time: 60000,
	incorrectMessage: "The pokémon isn't `{{answer}}`",
	buttonText: 'Cancel',
});
    }
    }