const Discord = require('discord.js');
const db = require('quick.db');

module.exports = {
	name: "staffrole",
    description: "Lets you edit the staff role",
    permissions: "MANAGE_GUILD",
    execute(message, args) {
    	let role = message.mentions.roles.first()
        if (!role) return message.channel.send(`${message.author}, mention a role!`)
        db.set(`staff_role_${message.guild.id}`, role.id);
        message.channel.send(`Staff role successfully set to ${role}`)
    }
}