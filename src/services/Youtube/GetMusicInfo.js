const ytdl = require("ytdl-core");

/**
 * 
 * @typedef {Object} Song
 * @property {string} songInfo
 * @property {string} url
 */


/**
 * 
 * @returns {Song}
 */
const getMusicInfo = async (link) => {
    const songInfo = await ytdl.getInfo(link);
    return {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
    };
}

module.exports = getMusicInfo;