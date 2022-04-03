const youtube = require("./Youtube");


/**
 * 
 * @param {string} content 
 * @returns {import("./../modules/Music").MusicInfo}
 */
 const setMusicInfoWithService = async (content) => {
    if (youtube.isYoutubeLink(content)) {
        return youtube.getMusicInfo(content)
    }
}


module.exports = {
    youtube,
    setMusicInfoWithService
}