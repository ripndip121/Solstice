const { Client, Intents, Collection} = require('discord.js');
const fs = require('fs');
const dotenv = require('dotenv');

const client = new Client({
	intents:
	[
		Intents.FLAGS.GUILD_INVITES,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES
	]
});

dotenv.config();


client.commands = new Collection();

const functions = fs.readdirSync("./functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./commands");


(async () => {
	for (file of functions) {
		require(`./functions/${file}`)(client);
	}
	client.handleEvents(eventFiles, "./events");
	client.handleCommands(commandFolders, "./commands");
	client.login(process.env.TOKEN);
})();