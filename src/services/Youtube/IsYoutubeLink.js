/**
 * @param {string} link 
 * @returns {boolean}
 */
const isYoutubeLink = (link) => {
    const youtubeIdentifier = 'youtube.com'
    const treatedLink = link.toLowerCase();
    return treatedLink.includes(youtubeIdentifier)
}

module.exports = isYoutubeLink;