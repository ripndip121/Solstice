const {MessageEmbed, Interaction} = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Displays the help window'),
        
    async execute(message, client, Discord) {

        const embed = new MessageEmbed()
        .setColor("ORANGE")
        .setTitle("Available Commands")
        .addFields(
                {name:`io`,value:"usage: <realm> <characterName>"},
                {name:`channeladd`,value:"usage: <channel_name>"},
                {name:`channeldelete`,value:"usage: <channel_name>"},
                {name:`setup`,value:"adds the required channels"},
        )
        await Interaction.reply(embed)
    }
}
