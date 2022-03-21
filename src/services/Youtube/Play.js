const ytdl = require("ytdl-core");

/**
 * 
 * @param {import("discord.js").Guild} guild 
 * @param {import("./GetMusicInfo").Song} song 
 * @param {import("./../../modules/Queue").serversQueues} queue 
 * @returns 
 */
const play = (guild, song, queue) => {
    const serverQueue = queue.get(guild.id);

    if (song === null || song == undefined) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }

    const dispatcher = serverQueue.connection
        .play(ytdl(song.url, {
            filter:"audioonly",
            quality:"highestaudio"
        }))
        .on("finish", () => {
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0], queue);
        })
        .on("error", error => {
            console.error(error);
            serverQueue.songs.shift();
        });
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Corno broxa ta tocando isso aqui agora: **${song.title}**`);
}

module.exports = play;


