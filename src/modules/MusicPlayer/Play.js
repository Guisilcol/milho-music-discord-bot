const Stream = require("stream");

/**
 * 
 * @param {import("./../Queue").Queue} serverQueue 
 * @param {Buffer} music 
 * @returns 
 */
const play = async (serverQueue, music) => {
    return await new Promise((resolve, reject) => {
        const dispatcher = serverQueue.connection
            .play(new Stream.Readable.from(music))
            .on("finish", () => {
                /*
                    Caso a função StreamDispatcher.end() for executada, esse listener ouvirá o evento
                */
                //serverQueue.songs.shift();
                //play(guild, serverQueue.songs[0], queue);
                resolve();
            })
            .on("error", error => {
                //console.error(error);
                //serverQueue.songs.shift();
                reject(error);
            });
        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    });
}

module.exports = play;