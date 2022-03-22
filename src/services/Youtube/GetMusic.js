const ytdl = require("ytdl-core");

/**
 * 
 * @param {string} url 
 * @returns {Promise<Buffer>}
 */
const getMusic = async (url) => {
    const downloadedSong = await new Promise((resolve, _) => {
        const chunks = [];
        
        ytdl(url, {
            filter: "audioonly"
        })
        .on("data", (chunk) => {
            chunks.push(chunk);
        })
        .on("end", () => {
            resolve(Buffer.concat(chunks));
        })
    });

    return downloadedSong;
}

module.exports = getMusic;