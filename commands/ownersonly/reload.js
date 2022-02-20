const Discord = require("discord.js");
const db = require('quick.db');
const fs = require('fs');

module.exports = {
	name: "reload",
    description: "Reloads a command for developer usage",
    cooldown: 1,
    async execute(message, args) {
        user = message.author;
        if (message.author.id === "809420610186772541" || message.author.id === "804777320123990108") {
            const commandName = args[0].toLowerCase();
			const command = message.client.commands.get(commandName)
				|| message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
            if (!command) {
			return message.channel.send(`I could not find a command called **\`${commandName}\`**, ${message.author}!`);
		}

		const commandFolders = fs.readdirSync('./commands');
		const folderName = commandFolders.find(folder => fs.readdirSync(`./commands/${folder}`).includes(`${command.name}.js`));

		delete require.cache[require.resolve(`../${folderName}/${command.name}.js`)];
        
        try {
			const newCommand = require(`../${folderName}/${command.name}.js`);
			message.client.commands.set(newCommand.name, newCommand);
			const reloadSuccessEmbed = new Discord.MessageEmbed()
			.setColor(0x2ECC71)
			.setAuthor(user.username, user.avatarURL(), message.author.avatarURL())
			.setTitle(`✅ I successfully reloaded the **\`${newCommand.name}\`** command!`)
			.setTimestamp()
			message.channel.send(reloadSuccessEmbed);
		} catch (error) {
			console.error(error);
			const reloadFailureEmbed = new Discord.MessageEmbed()
			.setColor(0xff4747)
			.setAuthor(user.username, user.avatarURL(), message.author.avatarURL())
			.setTitle(`\`❌\` Something went wrong while reloading the **\`${newCommand.name}\`** command!`)
            .setDescription(`ERROR: \`${error}\``)
			.setTimestamp()
			message.channel.send(reloadFailureEmbed);
		}
        } else {
            return message.reply("why tf you tryna reload my cmds")
        }
    }
}