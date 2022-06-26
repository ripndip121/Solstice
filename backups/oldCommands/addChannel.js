module.exports = {
    name:"channeladd",
    aliases:["addchannel"],
    description:"Add specified channel",
    Permissions:"ADMINISTRATOR",

    execute(message, client, Discord){
        const channel = message.content.split(" ");
        const channelSplit = channel[1];
        const fetchedChannel = message.guild.channels.cache.find(c => c.name === channelSplit);
        if(fetchedChannel){
            message.channel.send(`${channelSplit} channel exists!`);
        } else {
            try{
                message.guild.channels.create(channelSplit,{type:"GUILD_TEXT"})
                message.channel.send(`${channelSplit} channel has been created!`);
            }catch(e){
                console.log(e);
                message.channel.send(e);
            };
            };;
    }
};