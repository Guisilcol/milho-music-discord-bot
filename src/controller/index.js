const { createQueue } = require("../modules/Queue");
const youtubeService = require("../services/Youtube");
const Validation = require("./Validation");
const MediaPlayer = require("./../modules/MusicPlayer");

/**
 * 
 * @param {string} content 
 * @returns {import("./../modules/Music").MusicInfo}
 */
const setMusicInfoWithService = async (content) => {
    if (youtubeService.isYoutubeLink(content)) {
        return youtubeService.getMusicInfo(content)
    }
}

/**
* @description Toda mensagem enviada em canais de texto serão capturadas por essa função para análise e execução do bot
* @param {import("discord.js").Message} message
* @param {import("./../modules/Queue").serversQueues} serversQueues
* @param {import("./../config")} config
*/
const onMessage = async (message, serversQueues, config) => {

    if (Validation.isTheBotTheAuthor(message)) return;
    if (!Validation.isBotCommand(message, config)) return;

    const args = message.content.split(" ");

    const serverQueue = serversQueues.get(message.guild.id) === undefined
        ? createQueue(message.channel, message.member.voice.channel, message.guild)
        : serversQueues.get(message.guild.id);

    serversQueues.set(serverQueue.guild.id, serverQueue);

    if (message.content.startsWith(`${config.prefix} play `)) {
        try {
            const url = args[2];

            const firstMusicInfo = await setMusicInfoWithService(url);
    
            serverQueue.songs.push(firstMusicInfo);
    
            if (!serverQueue.playing) {
                if (serverQueue.connection === null) {
                    serverQueue.connection = await serverQueue.voiceChannel.join();
                }
    
                serverQueue.playing = true;
    
                while (serverQueue.songs[0] !== undefined) {
                    const musicInfo = serverQueue.songs[0];
                    const music = await youtubeService.getMusic(musicInfo.url);
    
                    await serverQueue.textChannel.send(`Corno broxa ta tocando isso aqui agora: **${musicInfo.title}**`);
                    await MediaPlayer.play(serverQueue, music);
                    serverQueue.songs.shift();
                }
    
                serverQueue.playing = false;
    
                serverQueue.voiceChannel.leave();
                serversQueues.delete(serverQueue.guild.id);
                return;
    
            } else {
                await message.channel.send(`${firstMusicInfo.title} foi adicionado na fila!`);
                return;
            }
        } catch (error) {
            console.error(error);
            await serverQueue.textChannel.send(`Ocorreu um **ERRO**: ${error.message}`);
        }
    } else if (message.content.startsWith(`${config.prefix} skip`)) {
        /*
        if (!Validation.userHavePermission(message)) return; 
        if (!Validation.userIsConnectedInChannel(message)) return; 
        */

        await MediaPlayer.skip(serverQueue);
    } else if (message.content.startsWith(`${config.prefix} stop`)) {
        await MediaPlayer.stop(serverQueue);
    } else if (message.content.startsWith(`${config.prefix} queue`)){
        
        let textContent = "";
        for(const [index, musicInfo] of serverQueue.songs.entries()){
            if(index === 0){
                textContent = textContent.concat(`${index} - **${musicInfo.title}** (rodando agora)\n`);
            }else{
                textContent = textContent.concat(`${index} - ${musicInfo.title}\n`);
            }
        }

        await serverQueue.textChannel.send(textContent);
    } else {
        await message.channel.send("Comando inválido!");
    }
}

const setupDiscordClient = (client, config, serversQueues) => {
    const date = new Date();

    client.once("ready", () => console.log(`> Bot em execução ${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getMilliseconds()}`));
    client.once("reconnecting", () => console.log("> Reconectando"));
    client.once("disconnect", () => console.log("> Desconectado"));

    client.on("message", (message) => onMessage(message, serversQueues, config));
}

module.exports = setupDiscordClient;