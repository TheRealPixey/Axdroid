const Discord = require('discord.js');
const db = require('quick.db');

module.exports = {
	name: "modchannel",
    execute(message, args) {
    	let channel = message.mentions.channels.first()
        if (!channel) return message.channel.send(`${message.author}, mention a channel!`)
        db.set(`modlog_channel_${message.guild.id}`, channel.id);
        message.channel.send(`Mod channel successfully set to ${channel}`)
    }
}