const ytdl = require("ytdl-core");
const Stream = require("stream");
/**
 * 
 * @param {import("discord.js").Guild} guild 
 * @param {import("./GetMusicInfo").Song} song 
 * @param {import("./../../modules/Queue").serversQueues} queue 
 * @returns 
 */
const play = async (guild, song, queue) => {
    const serverQueue = queue.get(guild.id);

    if (song === null || song == undefined) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }

    /** 
     * @type {Buffer}
     */
    const downloadedSong = await new Promise((resolve, _) => {
        const chunks = [];

        ytdl(song.url, {
            filter: "audioonly"
        })
        .on("data", (chunk) => {
            chunks.push(chunk);
        })
        .on("end", () => {
            resolve(Buffer.concat(chunks));
        })
    });

    const dispatcher = serverQueue.connection
        .play(new Stream.Readable.from(downloadedSong))
        .on("finish", () => {
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0], queue);
        })
        .on("error", error => {
            console.error(error);
            serverQueue.songs.shift();
        });
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    await serverQueue.textChannel.send(`Corno broxa ta tocando isso aqui agora: **${song.title}**`);
}

module.exports = play;


