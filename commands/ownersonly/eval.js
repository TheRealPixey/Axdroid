const Discord = require("discord.js");
const db = require('quick.db');
const fs = require('fs');

module.exports = {
	name: "eval",
    description: "Evaluates stuff",
    cooldown: 1,
    async execute(message, args) {
        if (message.author.id !== "809420610186772541" && message.author.id !== "804777320123990108") return message.reply("get tf away, eval is only for my owners")
    
	const cmd = args.join(" ")
    if (!cmd) return message.reply("please provide a command to evaluate!")
    
    if (cmd.toLowerCase().includes("token")) return message.reply("execution failed due to developer restrictions")
    try {
        const evaled = eval(cmd);
        const embed = new Discord.MessageEmbed()
        	.setTitle("`✅` Evaluation successful!")
        	.setAuthor(message.author.username, message.author.avatarURL())
        	.addFields(
            	{ name: "Input", value: `\`\`\`${message.content}\`\`\``, inline: false },
                { name: "Output", value: `\`\`\`${evaled}\`\`\``, inline: false },
            )
        	.setColor('49ff12')
        	.setTimestamp()
       	message.channel.send(embed)
    } catch (err) {
        const embed = new Discord.MessageEmbed()
        	.setTitle("`❌` Evaluation failed")
        	.setAuthor(message.author.username, message.author.avatarURL())
        	.addFields(
            	{ name: "Input", value: `\`\`\`${message.content}\`\`\``, inline: false },
                { name: "Output", value: `\`\`\`${err}\`\`\``, inline: false },
            )
        	.setTimestamp()
        	.setColor('ff1a12')
       	message.channel.send(embed)
    }
    }
}
