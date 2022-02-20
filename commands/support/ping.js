const Discord = require('discord.js');
const moment = require("moment");
require("moment-duration-format");

module.exports = {
    name: "ping",
    description: "Returns latency and API ping",
    cooldown: 3,
    async execute(message) {
      const client = message.client;
      const pingingEmbed = new Discord.MessageEmbed()
			.setDescription(`⏰   Attempting to ping **${client.user.tag}**...`)
			.setTimestamp()
        message.channel.send(pingingEmbed).then(m =>{
          try {
            var ping = m.createdTimestamp - message.createdTimestamp;
            const user = message.author;
            const duration = moment.duration(client.uptime).format("W[weeks] ,D [days], H [hrs], m [mins], s [secs]");
            const pingEmbed = new Discord.MessageEmbed()
                .setColor('BLUE')
                .setAuthor(user.username, user.avatarURL(), message.author.avatarURL())
                .setDescription(`🏓  Pong!\n**BOT PING** is: **\`${ping}ms\`**\n**BOT UPTIME** is: **\`${duration}\`**`)
                .setTimestamp()
			      m.edit(pingEmbed);
          } catch (err) {
            const pingEmbed = new Discord.MessageEmbed()
                .setColor('BLUE')
                .setAuthor(user.username, user.avatarURL(), message.author.avatarURL())
                .setDescription(`❌ I encountered an error when trying to ping myself\n**Error:**\n\`\`\`${err}\`\`\``)
                .setTimestamp()
			      m.edit(pingEmbed);
          }
        });
    }
}