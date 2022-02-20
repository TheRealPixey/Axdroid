const Discord = require('discord.js');


module.exports = {
    name: "support",
    description: "sends the support server invite link",
  usage: "[command]",
  cooldown: 1,
    async execute(message) {
      const client = message.client;
    const embed = new Discord.MessageEmbed()
    .setColor(`BLUE`)
    .setTitle(`Support Server Invite`)
    .setDescription(`[Click Here](https://discord.gg/DeU8hTwqzJ)`)
    message.channel.send(embed);
    }
}