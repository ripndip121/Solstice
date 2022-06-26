const { MessageEmbed } = require('discord.js')

module.exports = {
    name: "guildMemberRemove",
    execute(member){
        const guild = member.guild;
        const channel = guild.channels.cache.find(channel => channel.name === "log-channel")
        const message = new MessageEmbed()
        .setColor('RED')
        .setDescription(`<@${member.user.id}> has left ${member.guild.name}`)
        channel.send({embeds:[message]});
    }
}