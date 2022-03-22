/**
 * @typedef MusicInfo
 * @property {string} url 
 * @property {string} title
 * @property {('youtube' | 'spotify')} service
 */

/**
 * 
 * @param {MusicInfo} param
 * @returns {MusicInfo}
 */
const createMusicInfo = ({url, title, service}) => {
    return {
        url,
        title,
        service
    }
}

module.exports = createMusicInfo;