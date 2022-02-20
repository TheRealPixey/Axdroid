const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const fs = require('fs');

module.exports = {
  name: "help",
  aliases: ["h"],
  description: "Help Command!",
  usage: "Help | <Command Name>",
     async execute (message, args) {
    const client = message.client;
    let ut = Array.from(fs.readdirSync('commands/utility').filter(file => file.endsWith('.js')).map(a => a.replace(".js", "")));
    let fun = Array.from(fs.readdirSync('commands/fun').filter(file => file.endsWith('.js')).map(a => a.replace(".js", "")));
    let supportcmds = Array.from(fs.readdirSync('commands/support').filter(file => file.endsWith('.js')).map(a => a.replace(".js", "")));
    let tc = Array.from(fs.readdirSync('commands/tickets').filter(file => file.endsWith('.js')).map(a => a.replace(".js", "")));
    let cccmds = Array.from(fs.readdirSync('commands/configcommands').filter(file => file.endsWith('.js')).map(a => a.replace(".js", "")));
    let embed = new MessageEmbed()
    	.setTitle(`${client.user.username} Commands!`)
    	.setDescription(`Use \`-help <command name>\` for more info about a command!`)
    	.addFields(
        	{ name: "Fun", value: `\`\`\`\n${fun.join("\n")}\n\`\`\``, inline: true },
            { name: "Support", value: `\`\`\`\n${supportcmds.join("\n")}\n\`\`\``, inline: true },
            { name: "Config Commands", value: `\`\`\`\n${cccmds.join("\n")}\n\`\`\``, inline: true },
            { name: "Utility", value: `\`\`\`\n${ut.join("\n")}\n\`\`\``, inline: true },
            { name: "Tickets", value: `\`\`\`\n${tc.join("\n")}\n\`\`\``, inline: true },
        )
    	.setFooter(`Requested By ${message.author.username}`)
    	.setAuthor(message.author.username, message.author.avatarURL())
    	.setColor("PINK")
    	.setTimestamp();

    
    if (!args.length) return message.channel.send(embed);

    let cmd =
      client.commands.get(args[0].toLowerCase()) ||
      client.commands.get(client.aliases.get(args[0].toLowerCase()));

    let embed2 = new MessageEmbed()
      .setTitle(`${cmd.name} Information!`)
      .addField(`Aliases`, cmd.aliases || "None!")
      .addField(`Usage`, cmd.usage || "No Usage")
      .addField(`Description`, cmd.description || "No Description!")
      .setTimestamp();

    if (cmd) {
      return message.channel.send(embed2);
    } else {
      return message.channel.send(embed);
    }
  }
};
