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

    async execute(interaction) {

        const realm = interaction.options.getString('realm');
        const name = interaction.options.getString('name');

        /*
        Gather information from WCL API v2
        */
        let url = 'https://www.warcraftlogs.com/api/v2/';
        const charQuery = `
            {
                characterData{
                    character(name: "${name}", serverSlug: "${realm}", serverRegion: "us") {
                        id
                        canonicalID
                        level
                        name
                        server
                        {
                            name
                        }
                        classID
                        faction {
                            id
                            name
                        }
                        zoneRankings			
                    }
                }
            }
        `
        
        let options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: process.env.WLTOKEN
          },
          body: JSON.stringify({query:charQuery}) 
        };
        

        async function bestPerformance(){
            var bestPerf;

            const results = await fetch(url, options)
            .then(res => res.json())
            .then(data => obj = data.data.characterData.character.zoneRankings.bestPerformanceAverage)
            .catch(err => console.error('error:' + err));

            bestPerf = await results

            return bestPerf.toString()
        }

        // await getData();

        /*
        Gather information from raider IO's API
        */

        // Set api profile
        const profileUrl = `https://raider.io/api/v1/characters/profile?region=us&realm=${realm}&name=${name}&fields=mythic_plus_scores,raid_progression,gear,guild,covenant`

        let dataFetch = await fetch(profileUrl);
        // Get json data from dataFetch
        let jsonData = await dataFetch.text();
        const parsedJson = await JSON.parse(jsonData)
        const bestPerf = await bestPerformance()

        // Setup new embed message with json data attached
        const response = new MessageEmbed()
            .setColor('GREEN')
            .setURL(profileUrl)
            .setThumbnail(parsedJson.thumbnail_url)
            .addFields(
                { name: 'Name', value: parsedJson.name, inline: true },
                { name: 'Class', value: parsedJson.class, inline: true },
                { name: 'Spec', value: parsedJson.active_spec_name, inline: true },
                { name: 'Item Level', value: parsedJson.gear.item_level_equipped.toString() },
                { name: 'Covenant', value: parsedJson.covenant.name, inline: true },
                { name: 'Renown', value: parsedJson.covenant.renown_level.toString(), inline: true },
                { name: 'Raider IO Profile', value: parsedJson.profile_url.toString() },
                { name: 'Sepulcher of the First Ones', value: parsedJson.raid_progression["sepulcher-of-the-first-ones"].summary.toString() },
                { name: 'IO Score', value: parsedJson.mythic_plus_scores.all.toString() },
                { name: 'Warcraft Logs Profile', value:`https://www.warcraftlogs.com/character/us/${realm}/${name}`},
                { name: 'Best Perf.Avg', value: bestPerf },
                { name: 'Achievement Points', value: parsedJson.achievement_points.toString() },
                { name: 'Guild', value: parsedJson.guild.name, inline: true },
                { name: 'Realm', value: parsedJson.guild.realm, inline: true },

            )
        await interaction.reply({ embeds: [response] });
    }

}