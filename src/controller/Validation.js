
/**
 * @param {import("discord.js").Message} message
 * @returns {boolean}
 */
const userHavePermission = (message) => {
    const permissions = serverQueue.voiceChannel.permissionsFor(message.client.user);
    //O bot tem permissão de entrar em sala e falar?
    return (!permissions.has("CONNECT") || !permissions.has("SPEAK")); 
    
};

/**
 * @param {import("discord.js").Message} message
 * @returns {boolean}
 */
const userIsConnectedInChannel = (message) => {
    return !message.member.voice.channel === null;
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
const isTheBotTheAuthor = (message) => {
    return message.author.bot;
};

module.exports = {
    userHavePermission,
    userIsConnectedInChannel,
    isBotCommand,
    isTheBotTheAuthor
}