const { Client, Message, MessageEmbed, Collection } = require('discord.js');
require('dotenv').config();

const prefix = process.env.PREFIX;

module.exports = {
    name: "messageCreate",
    /**
     * @param {Client} client
     * @param {Message} message
     */
    async execute(message, client, Discord) {
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).trim().split(' ');
        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName) ||
        client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if(!command) return;

        if (command.permissions) {
            const authorPerms = message.channel.permissionsFor(message.author);
            if (!authorPerms || !authorPerms.has(command.permissions)) {
                const noPerms = new MessageEmbed()
                .setColor('RED')
                .setDescription('You do not have the required permissions to run this command!')
                message.channel.send({embeds: [noPerms]})
                .then((sent) =>{
                    setTimeout(() =>{
                        sent.delete();
                    },2000);
                });
            };
        };
        const { cooldowns } = client;
        if (!cooldowns.has(command.name)){
            cooldowns.set(command.name, new Collection());
        };
        const now = Date.now();
        const timeStamp = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 1) * 1000;

        if (timeStamp.has(message.author.id)) {
            const expirationTime = timeStamp.get(message.author.id) + cooldownAmount;
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                const timeLeftEmbed = new MessageEmbed()
                .setColor('RED')
                .setDescription(`Please wait another ${timeLeft.toFixed(1)} more seconds to be able to run this command again.`)
                return message.channel.send({embeds:[timeLeftEmbed]})
                .then((sent) =>{
                    setTimeout(() =>{
                        sent.delete();
                    },2000);
                });
            };
        };

        timeStamp.set(message.author.id, now);
        setTimeout(() => timeStamp.delete(message.author.id), cooldownAmount);

        try {
            command.execute(message, commandName, client, Discord);
        } catch (err) {
            console.log(err);
            const errorEmbed = new MessageEmbed()
            .setColor('RED')
            .setDescription(`Am Error occured while trying to run this command, check console for more details.`)
            message.channel.send({embed:[errorEmbed]});
        }
    }
};
