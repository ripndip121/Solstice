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
            Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5NmM5ZDIwMi0yYjE0LTQ0MDctYTQ3ZS0yNGQzODUxZWU5MmIiLCJqdGkiOiJkMGE5N2IwYTRkMTAzMDc5YzZmNTEwOGYzMTYxNTU2MzkzZDA3MWZiMjhkNDE4ZGRjZjFiNjQyNGJiYTAyOWI4ZTFiYTM5ZWM3YjE5OWE2NyIsImlhdCI6MTY1Nzk5MjE2OS44NjkyOTksIm5iZiI6MTY1Nzk5MjE2OS44NjkzMDMsImV4cCI6MTY4OTA5NjE2OS44NjA1NDIsInN1YiI6IjExOTg1MTMiLCJzY29wZXMiOlsidmlldy11c2VyLXByb2ZpbGUiLCJ2aWV3LXByaXZhdGUtcmVwb3J0cyJdfQ.Kpp3YF5X0IEQImq4j-7o-akGjS8M6nXqFaTkNPRS7z2JFddtHOuabUzsF1SK21m2iArkVLawTO5t_FJuxyN4WFNJFOPJ9ld0RirGAKP6PHvPL4K-t9cAWx53U1ECewPMiK_Iu9fUrSYQDuJ377mTIllu-JBR99ltq0RkmnxcyrUX7JdKdeiTuTCy-0Zp4Vx8YmXN32R0YqD8tYFy6a3JLORit9sZnz_Ticp4sLHRGt7h4JQet9ubHqPy1F-CdoJ6hU0arNQmzS3xywGXx5eu2jlZ0blH3XWMz_9iPmQUKqaIYpKAVx-SV88Y22Bfb-vxACZeceTZSRiZV8KlJSGLHxqvOfP64kfTbYQWhBVTlAfqB31eU1fkZ1qIiDz5RAcRyb5UgOCIJelri_3H1TapTrv6NWngbOP0e6k_j_iwUu6RSnsnjmVD9JEpHnaiZxPAVxD-DkyxDQsiBJFFYGb-R-4qRinfN1FlAiO2VQhMYZRJcaI-x7xfXhw8N8DKN7OlbQypZDCaPbMkhCPXlBYwTmJjd6H3yRVkUvGfvoNj3XyAmXzjKAUZzpezaQubGjTELYIs4U8743MmGvKaOz3V97eObr87SGw5ONax0F0h2wc1u-2MJHzfBLjwgropD7-hwMwz0aIIcOm_AicKAwsC6jbcRJ8rivFDDvjMSHMQ8qA'
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