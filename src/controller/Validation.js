const { MessageAttachment } = require("discord.js");

/**
 * @param {import("discord.js").Message} message
 * @param {import("./../modules/Queue").Queue} serverQueue
 * @returns {boolean}
 */
const userHavePermission = (message) => {
    const permissions = message.member.voice.channel.permissionsFor(message.client.user);
    //O bot tem permissão de entrar em sala e falar?
    return (permissions.has("CONNECT") && permissions.has("SPEAK")); 
    
};

/**
 * @param {import("discord.js").Message} message
 * @returns {boolean}
 */
const isPrivateMessage = (message) => {
    return (message.guild === null || message.guild === undefined);
}

/**
 * @param {import("discord.js").Message} message
 * @param {import("discord.js").Guild} guild
 * @returns {boolean}
 */
const userIsOnTheSameVoiceChannelAsTheBot = (message) => {
    const botVoiceChannel = message.guild.voice.channel;
    const memberVoiceChannel = message.member.voice.channel;
    return (botVoiceChannel === memberVoiceChannel);
}

/**
 * 
 * @param {import("discord.js").Message} message
 */
const botIsConnectedInVoiceChannel = (message) => {
    const guild = message.guild;
    
    if(guild === null) {
        return false;
    }

    if(guild.voice === null || guild.voice === undefined){
        return false;
    }
    if(guild.voice.connection === null){
        return false;
    } 

    return true;
}

/**
 * @param {import("discord.js").Message} message
 * @returns {boolean}
 */
const userIsConnectedInVoiceChannel = (message) => {

    return !!message.member.voice.channel;
};

/**
 * @param {import("discord.js").Message} message
 * @returns {boolean}
 */
const isBotCommand = (message, config) => {
    return message.content.startsWith(config.prefix)
};

/**
 * @param {import("discord.js").Message} message
 * @returns {boolean}
 */
const isABotTheAuthor = (message) => {
    return message.author.bot;
};

module.exports = {
    userHavePermission,
    userIsConnectedInVoiceChannel,
    isBotCommand,
    isABotTheAuthor,
    userIsOnTheSameVoiceChannelAsTheBot,
    botIsConnectedInVoiceChannel,
    isPrivateMessage
}