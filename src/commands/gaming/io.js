const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');
const {SlashCommandBuilder} = require('@discordjs/builders');

require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('io')
        .setDescription('Grabs IO score from raider.io')
        .addStringOption(option =>
            option.setName('realm')
                .setDescription('Input Characters realm.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Input Characters Name.')
                .setRequired(true)),

    async execute(interaction){

        const realm = interaction.options.getString('realm');
        const name = interaction.options.getString('name');
        
        // Set api profile
         const profileUrl = `https://raider.io/api/v1/characters/profile?region=us&realm=${realm}&name=${name}&fields=mythic_plus_scores,raid_progression,gear,guild,covenant`

        let dataFetch = await fetch(profileUrl);
        // Get json data from dataFetch
        let jsonData = await dataFetch.text();
        const parsedJson = await JSON.parse(jsonData)

        // Setup new embed message with json data attached
        const response = new MessageEmbed()
        .setColor('GREEN')
        .setURL(profileUrl)
        .setThumbnail(parsedJson.thumbnail_url)
        .addFields(
            { name: 'Class', value: parsedJson.name.toString(), inline:true },
            { name: 'Class', value: parsedJson.class.toString(), inline:true },
            { name: 'Spec', value: parsedJson.active_spec_name.toString(), inline: true },
            { name: 'Item Level', value: parsedJson.gear.item_level_equipped.toString() },
            { name: 'Covenant', value: parsedJson.covenant.name.toString(), inline:true },
            { name: 'Renown', value: parsedJson.covenant.renown_level.toString(), inline:true },
            { name: 'Sepulcher of the First Ones', value: parsedJson.raid_progression["sepulcher-of-the-first-ones"].summary.toString()},
            { name: 'IO Score', value: parsedJson.mythic_plus_scores.all.toString() },
            { name: 'Raider IO Profile', value: parsedJson.profile_url.toString()},
            { name: 'Achievement Points', value: parsedJson.achievement_points.toString() },
            { name: 'Guild', value: parsedJson.guild.name.toString(), inline: true },
            { name: 'Realm', value: parsedJson.guild.realm.toString(), inline: true },

        )
        console.log(parsedJson)
        await interaction.reply({embeds:[response]});
        console.log('IO command finished!')
    }
    
}