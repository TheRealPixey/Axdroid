const Discord = require("discord.js");
const db = require('quick.db');
const fs = require('fs');

module.exports = {
	name: "cmdstat",
    description: "Sets a command to be disabled or enabled",
    cooldown: 1,
    permissions: "ADMINISTRATOR",
    async execute(message, args) {
        user = message.author;
        	if (!args[0]) return message.reply("please provide a command!")

  
            const commandName = args[0].toLowerCase();
			const command = message.client.commands.get(commandName) 
               if (command.name === "cmdstat") return;

				 message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
            if (!command) {
                let folder = fs.readdirSync(`commands/${commandName}`);
                if (folder) {
                    if (!args[1]) return message.reply("provide a mode dammit")
                    let mode_mode = args[1].toLowerCase();
                    let mode = "";
                    if (mode_mode === "e" || mode_mode === "enable") {
                        mode = "enabled"
                    } else if (mode_mode === "d" || mode_mode === "disable") {
                        mode = "disabled"
                    } else {
                        return message.reply("that is not a valid mode!")
                    }
                        const commandFiles = fs.readdirSync(`commands/${commandName}`);
                        for (const file of commandFiles) {
                            let lecmd = commandFiles.filter(filelol => filelol.endsWith('.js')).map(a => a.replace(".js", ""));
                            db.set(`command_mode_${lecmd}_${message.guild.id}`, mode);
                            message.channel.send(`:check: ${mode} **${lecmd}**`)
                        }
                    const reloadSuccessEmbed = new Discord.MessageEmbed()
                        .setColor(0x2ECC71)
                        .setAuthor(user.username, user.avatarURL(), message.author.avatarURL())
                        .setTitle(`✅ I successfully set all commands in the **\`${commandFiles}\`** folder to **${mode}**!`)
                        .setTimestamp()
                        message.channel.send(reloadSuccessEmbed);
                } else {
					return message.channel.send(`I could not find a command called **\`${commandName}\`**, ${message.author}!`);
                }
			}
            
            if (command.name === "disable" || command.name === "enable") return;
        	if (!args[1]) return message.reply("please provide a mode! (**enable**/**disable**)")
            const mode_mode = args[1].toLowerCase();
            let mode = "";
            if (mode_mode === "e" || mode_mode === "enable") {
           		mode = "enabled"
            } else if (mode_mode === "d" || mode_mode === "disable") {
            	mode = "disabled"
            } else {
            	return message.reply("that is not a valid mode!")
            }
        
        try {
			db.set(`command_mode_${command.name}_${message.guild.id}`, mode);
			const reloadSuccessEmbed = new Discord.MessageEmbed()
			.setColor(0x2ECC71)
			.setAuthor(user.username, user.avatarURL(), message.author.avatarURL())
			.setTitle(`✅ I successfully set **\`${command.name}\`** to **${mode}**!`)
			.setTimestamp()
			message.channel.send(reloadSuccessEmbed);
		} catch (error) {
			console.error(error);
			const reloadFailureEmbed = new Discord.MessageEmbed()
			.setColor(0xff4747)
			.setAuthor(user.username, user.avatarURL(), message.author.avatarURL())
			.setTitle(`\`❌\` Something went wrong while setting the **\`${command.name}\`** command's mode!`)
            .setDescription(`ERROR: \`${error}\``)
			.setTimestamp()
			message.channel.send(reloadFailureEmbed);
		}
    }
}
