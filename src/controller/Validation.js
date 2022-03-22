const userHavePermission = () => true;
const userIsConnectedInChannel = () => true;

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