

/**
 * @typedef {Object} Queue
 * @property {import("discord.js").TextChannel} textChannel
 * @property {import("discord.js").VoiceChannel} voiceChannel
 * @property {import("discord.js").VoiceConnection | null} connection 
 * @property {import("discord.js").Guild} guild
 * @property {import("./../Music").MusicInfo[]} songs
 * @property {number} volume
 * @property {boolean} playing
 */

/**
 * @param {import("discord.js").TextChannel} textChannel 
 * @param {import("discord.js").VoiceChannel} voiceChannel 
 * @param {import("discord.js").Guild} guild 
 * @returns {Queue} Discord server Queue
 */
const createQueue = (textChannel, voiceChannel, guild) => {
    return {
        textChannel: textChannel,
        voiceChannel: voiceChannel,
        guild: guild,
        connection: null,
        songs: [],
        volume: 5,
        playing: false
    }
}

/**
 * @typedef {Map<string, Queue>} serversQueues
 */

/**
 * 
 * @returns {serversQueues}
 */
const createMapQueue = () => new Map();

module.exports = {createQueue, createMapQueue};