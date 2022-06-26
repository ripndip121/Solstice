const { MessageEmbed } = require('discord.js')

module.exports = {
    name: "guildMemberAdd",
    execute(member){
        // Log new members data to console.
        console.log(member);        
        // Changes new member role to member.
        let setRole = "Member" // Change to role you want your new member to be.
        let role = member.guild.roles.cache.find(role => role.name === setRole);
        member.roles.add(role);
        // Send message to welcome channel.
        const guild = member.guild;
        const channel = guild.channels.cache.find(channel => channel.name === "welcome")
        const message = new MessageEmbed()
        .setColor('GREEN')
        .setDescription(`Welcome <@${member.user.id}> to ${member.guild.name}`)
        channel.send({embeds:[message]});
    }
}