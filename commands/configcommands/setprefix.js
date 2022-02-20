const { MessageEmbed } = require('discord.js');
const db = require('quick.db');
const disbut = require("discord-buttons");

module.exports = {
    name: 'setprefix',
    usage: '<new prefix>',
    args: true,
    description: 'Lets you change the prefix of the bot',
    permissions: 'MANAGE_GUILD',
    async execute(msg, args) {
        let new_prefix = args[0];
        if (!new_prefix) return msg.reply("please provide a prefix!")
        if (new_prefix === "-default") {
            let yes_butt = new disbut.MessageButton()
                .setLabel("Yes")
                .setID("default_prefix_yes")
                .setStyle("green");  
            let no_butt = new disbut.MessageButton()
                .setLabel("No")
                .setID("default_prefix_no")
                .setStyle("red");  
            let row = new disbut.MessageActionRow()
                .addComponents(yes_butt, no_butt);
            msg.channel.send("❓ **Are you sure you want to change the prefix back to the default one?**", row)
        } else {
            db.set(`prefix_${msg.guild.id}`, new_prefix);

            const emb = new MessageEmbed()
                .setDescription(`✅ **Prefix changed to:** \`${new_prefix}\``)
            msg.channel.send(emb);
        }
    }
};