const { ChaosWords } = require('weky');
var randomWords = require('random-words');
const Discord = require('discord.js');

module.exports = {
	name: "chaoswords",
    description: "Creates a game where you have to find hidden words embedded in a random string!",
    usage: "[command]",
    guildOnly: false,
    cooldown: 5,
    async execute(message, args) {
    	const words = randomWords(4);
        await ChaosWords({
    message: message,
    embed: {
        title: 'CHAOS WORDS',
        description: 'You have to find the hidden words embedded in the sentence below in **{{time}}**!',
        color: '#7289da',
        field1: 'Sentence:',
        field2: 'Words Found/Remaining Words:',
        field3: 'Words found:',
        field4: 'Words:',
        timestamp: true
    },
    winMessage: 'You won! You completed the challenge in **{{time}}**.',
    loseMessage: 'OOF, you lost. Better luck next time!',
    wrongWordMessage: 'That\'s wrong! You have **{{remaining_tries}}** tries left.',
    correctWordMessage: '**{{word}}** was correct! You have **{{remaining}}** words left.',
    time: 60000,
    words: words,
    charGenerated: 17,
    maxTries: 10,
    buttonText: 'Cancel',
    othersMessage: 'Only <@{{author}}> can use the buttons!'
});
    }
    }