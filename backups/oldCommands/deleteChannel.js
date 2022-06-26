module.exports = {
    name:"channeldelete",
    aliases:["removechannel"],
    description:"Delete specified channel",
    Permissions:"ADMINISTRATOR",

    execute(message, client, Discord){
        const channel = message.content.split(" ");
        const channelSplit = channel[1];
        const fetchedChannel = message.guild.channels.cache.find(c => c.name === channelSplit);
        console.log(fetchedChannel);
        if(!fetchedChannel){
            message.channel.send(`${channelSplit} channel doesn't exists!`);
        } else {
            try{
                fetchedChannel.delete(fetchedChannel);
                message.channel.send(`${channelSplit} channel has been deleted!`);
            }catch(e){
                console.log(e);
            };
            };;
    }
};