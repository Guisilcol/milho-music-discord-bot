const ytdl = require("ytdl-core");
const createMusicInfo = require("./../../modules/Music");

/**
 * @param {string} link
 * @returns {import("./../../modules/Music").MusicInfo}
 */
const getMusicInfo = async (link) => {
    const songInfo = await ytdl.getInfo(link);
    return createMusicInfo({
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
        service: 'youtube'
    });
}

module.exports = getMusicInfo;