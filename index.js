const fs = require('fs');
const ms = require('ms');
const Discord = require('discord.js');
const db = require('quick.db');
const SQLite = require("better-sqlite3")
var { prefix, token } = require('./config.json');
require('@weky/inlinereply');
const { readdirSync } = require("fs");
const cooldowns = new Discord.Collection();
const client = new Discord.Client({
  shardId: process.argv[1],
  shardCount: process.argv[2],
  fetchAllMembers: true
});
const disbut = require('discord-buttons');
disbut(client);
const {AntiRaid} = require('discord-antiraid');
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

class AntiRaidWithDB extends AntiRaid {
    async getOptionsFromDB(id) {
        return db.get(`antiraid_${id}`);
    }
};
const antiraid = new AntiRaidWithDB(client, {
    rateLimit: 3,
    time: 10000,
    ban: true,
    kick: false,
    unrank: false,
    exemptMembers: [],
    exemptRoles: [],
    exemptEvent: [],
    reason: "discord-antiraid"
});

antiraid.on("punish", (member, reason, sanction) => {
    let logs = member.guild.channels.cache.get(db.get(`modlog_channel_${member.guild.id}`));
    if (!logs) return;
    logs.send(`${member.user.username} got banned for attempting to raid the server.`);
})

let blacklist = [];
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();
const commandFolders = fs.readdirSync('./commands');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}

const { GiveawaysManager } = require('discord-giveaways');

const manager = new GiveawaysManager(client, {
    updateCountdownEvery: 10000,
    hasGuildMembersIntent: false,
    default: {
        botsCanWin: false,
        embedColor: '#2F3136',
        embedColorEnd: '#000000',
        reaction: '🎉'
    }
});

client.giveawaysManager = manager;

client.on('message', message => {
    let xp = db.get(`guild_${message.guild.id}_xp_${message.author.id}`) || 0;
    let newxp = db.set(`guild_${message.guild.id}_xp_${message.author.id}`, xp + db.get(`guild_${message.guild.id}_xp_per_msg`));
	try {
		let prefixes = db.get(`prefix_${message.guild.id}`);
		if (!prefixes) {
			prefix = "-"
		} else {
            if (message.channel.type == 'dm') {
                
            } else {
                prefix = prefixes;
            }
    }
	} catch (err) {
		console.log(err);

	}
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	
    for (let value of blacklist) {
        if (value === message.author.id) {
            return;
    }
    }
    
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	if (!client.commands.has(commandName)) return;
	const command = client.commands.get(commandName) || client.commands.find(c => c.aliases && c.aliases.includes(commandName));
	if (!command) {
		return message.reply("EEEE");
	}
	if (command.guildOnly && message.channel.type === 'dm') {
		const dmerrorEmbed = new Discord.MessageEmbed()
			.setDescription('❌ This command cannot be executed in DMs!')
			.setTimestamp()
		message.channel.send(dmerrorEmbed);
	}

	if (command.permissions) {
		try {
			if (!message.member.hasPermission(command.permissions)) {
				const permserrorEmbed = new Discord.MessageEmbed()
				.setDescription(`❌ You do not have the permissions for the **${command.name}** command!`)
			.setTimestamp()
			return message.reply(permserrorEmbed);
			}
		} catch (err) {
			console.log(err);
		}
	}

	if (command.args && !args.length) {
		let usage = ''

		if (command.usage) {
			usage += `${prefix}${command.name} ${command.usage}`
		} else {
			usage += "**No usage.**"
		}

		user = message.author
		const missingArgsEmbed = new Discord.MessageEmbed()
			.setDescription(`❌ Incorrect command usage for **${command.name}**\nUsage: \`${usage}\``)
			.setTimestamp()
		return message.channel.send(missingArgsEmbed);
	}

	const { cooldowns } = client;

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before using the **\`${command.name}\`** command again!`);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
        const mode = db.get(`command_mode_${command.name}_${message.guild.id}`);
        if (command.premium) {
            const premium = db.get(`user_premium_${message.author.id}`);
            if (!premium || premium === 'false') {
                return message.reply("only users with premium may use this command!")
            } else if (premium === 'true') {
                if (!mode || mode === "enabled") {
                    command.execute(message, args);
                } else if (mode === "disabled") {
                    return message.reply("this command has been disabled by the servers owners.")
                } else {
                    return;
                }
            } else {
                return;
            }
        } else {
            if (!mode || mode === "enabled") {
                    command.execute(message, args);
                } else if (mode === "disabled") {
                    return message.reply("this command has been disabled by the server owners.")
                } else {
                    return;
                }
        }
        const logs = client.channels.cache.find(channel => channel.id === "900833085329903696")
        if (command.name === "eval") {
            const embed = new Discord.MessageEmbed()
                    .setTitle(`⚠️ **${command.name}** cmd ran!`)
            		.setColor('ffcf21')
                    .setAuthor(`${message.author.username}`, message.author.avatarURL())
            		.setDescription("A user just ran eval.")
            		.addFields(
                    	{ name: "Command Name", value: command.name, inline: false },
                        { name: "Guild Name", value: message.guild, inline: false },
                        { name: "Guild ID", value: message.guild.id, inline: false },
                        { name: "Guild Owner", value: message.guild.owner.username, inline: false },
                        { name: "Message ID", value: message.id, inline: false },
                        { name: "Message Author", value: message.author.username, inline: false },
                        { name: "Message Author ID", value: message.author.id, inline: false },
                        { name: "Message Content", value: `\`\`\`${message.content}\`\`\``, inline: false },
                    )
                    .setTimestamp()
                logs.send(embed)
        } else {
            const embed = new Discord.MessageEmbed()
                    .setTitle(`**${command.name}** cmd ran!`)
                    .setAuthor(`${message.author.username}`, message.author.avatarURL())
            		.addFields(
                    	{ name: "Command Name", value: command.name, inline: false },
                        { name: "Guild Name", value: message.guild, inline: false },
                        { name: "Guild ID", value: message.guild.id, inline: false },
                        { name: "Guild Owner", value: message.guild.owner.username, inline: false },
                        { name: "Message ID", value: message.id, inline: false },
                        { name: "Message Author", value: message.author.username, inline: false },
                        { name: "Message Author ID", value: message.author.id, inline: false },
                        { name: "Message Content", value: `\`\`\`${message.content}\`\`\``, inline: false },
                    )
                    .setTimestamp()
                logs.send(embed)
        }
	} catch (error) {
		console.error(error);
	}
});

client.on('clickButton', async (button) => {
    if (parseInt(button.clicker.member.id) !== 804777320123990108) return;
    if (button.id === "btntest1") {
		button.channel.send("✅ **API Authorized:** my endpoint ID has successfully been connected to.")
	}
});

client.login(token);



const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send(
    "Hi"  );
});

app.listen(port, () => {
  console.log(`Axdroid is now ready`);
});







const { AutoPoster } = require('topgg-autoposter')

const poster = AutoPoster('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg1MTQ4ODEwNzcxODI0NjQwMCIsImJvdCI6dHJ1ZSwiaWF0IjoxNjMwMTYwMTUzfQ.z_Gs0QdCP4IvfpXw0iria51TuwEBLZayzJyYXWWqn2A', client) 

poster.on('posted', (stats) => { 
  console.log(`Posted stats to Top.gg | ${stats.serverCount} servers`)
})



