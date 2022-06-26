module.exports = {
    name:"setup",
    description:"Add required channels to the server.",

    execute(message, client, Discord){
 
        const welcome = "welcome";
        const twitch = "twitch-streaming";
        const logChannel = "log-channel" ;

        if(message.guild.channels.cache.find(c => c.name.toLowerCase() === logChannel)){
            message.channel.send(`${logChannel} channel already exists!`);
        } else {
            try{
                message.guild.channels.create(logChannel,{type:"GUILD_TEXT"});
                message.channel.send(`${logChannel} channel created!`);
            }catch(e){
                console.log(e);
            };
        };

        if(message.guild.channels.cache.find(c => c.name.toLowerCase() === welcome)){
            message.channel.send(`${welcome} channel already exists!`);
        } else {
            try{
                message.guild.channels.create(welcome,{type:"GUILD_TEXT"});
                message.channel.send(`${welcome} channel created!`);
            }catch(e){
                console.log(e);
            };
            };
        if(message.guild.channels.cache.find(c => c.name.toLowerCase() === twitch)){
            message.channel.send(`${twitch} channel already exists!`);
        } else {
            try{
                message.guild.channels.create(twitch,{type:"GUILD_TEXT"});
                message.channel.send(`${twitch} channel created!`);
            }catch(e){
                console.log(e);
            };
            };   
        }   
};