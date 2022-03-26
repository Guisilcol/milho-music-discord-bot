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
* @param {import("discord.js").Client} client
*/
const onMessage = async (message, serversQueues, config, client) => {
    const args = message.content.split(" ");
    const textChannel = message.channel;
    /*
    const serverQueue = serversQueues.get(message.guild.id) === undefined
        ? createQueue(message.channel, message.member.voice.channel, message.guild)
        : serversQueues.get(message.guild.id);
        
    serversQueues.set(serverQueue.guild.id, serverQueue);
    */


    /* 
        TRECHO DE VALIDACAO
    */

    if (Validation.isTheBotTheAuthor(message)) return;
    if (!Validation.isBotCommand(message, config)) return;

    /*
        24/03/2022 
        Guilherme 
        Não consegui implementar a validação de permissões do usuário.
        Será necessário uma análise e esforço maior.
    */
    /*
     if (!Validation.userHavePermission(message)){
         await serverQueue.textChannel.send("O cabaço, tu não tem permissão falar ou de ouvir");
         return;
     }
     */

    /* 
        TRECHO DE COMANDOS
    */
    if (message.content.startsWith(`${config.prefix} play `)) {
        try {
            if (!Validation.userIsConnectedInVoiceChannel(message)) {
                await textChannel.send("Dar play em musica fora da sala de voz = chuva em chapecó");
                return;
            }

            if (Validation.botIsConnectedInVoiceChannel(message)) {
                if (!Validation.userIsOnTheSameVoiceChannelAsTheBot(message)) {
                    await textChannel.send("Entra no mesmo canal de voz do bot DESGRAÇA");
                    return;
                }
            }

            const voiceChannel = Validation.botIsConnectedInVoiceChannel(message) ?
                message.guild.voice
                : message.member.voice;

            const connection = Validation.botIsConnectedInVoiceChannel(message) ?
                message.guild.voice.connection
                : await message.member.voice.channel.join();

            const guild = Validation.botIsConnectedInVoiceChannel(message) ?
                message.guild
                : message.guild;

            const serverQueue = serversQueues.get(message.guild.id) === undefined
                ? createQueue(textChannel, voiceChannel, guild, connection)
                : serversQueues.get(message.guild.id);

            serversQueues.set(serverQueue.guild.id, serverQueue);

            const url = args[2];

            const firstMusicInfo = await setMusicInfoWithService(url);

            serverQueue.songs.push(firstMusicInfo);

            if (!serverQueue.playing) {
                serverQueue.playing = true;

                while (serverQueue.songs[0] !== undefined) {
                    const musicInfo = serverQueue.songs[0];
                    const music = await youtubeService.getMusic(musicInfo.url);

                    await serverQueue.textChannel.send(`Corno broxa ta tocando isso aqui agora: **${musicInfo.title}**`);
                    await MediaPlayer.play(serverQueue, music);
                    serverQueue.songs.shift();
                }

                serverQueue.playing = false;

                serverQueue.connection.disconnect();
                serversQueues.delete(serverQueue.guild.id);
                return;

            } else {
                await message.channel.send(`${firstMusicInfo.title} foi adicionado na fila!`);
                return;
            }
        } catch (error) {
            console.error(error);
            await textChannel.send(`Ocorreu um **ERRO**: ${error.message}`);
            if(Validation.botIsConnectedInVoiceChannel(message)){
                await message.guild.voice.connection.disconnect();
                serversQueues.delete(message.guild.id);
            }
        }
    } else if (message.content.startsWith(`${config.prefix} skip`)) {
        await MediaPlayer.skip(serverQueue);

    } else if (message.content.startsWith(`${config.prefix} stop`)) {
        await MediaPlayer.stop(serverQueue);

    } else if (message.content.startsWith(`${config.prefix} queue`)) {

        let textContent = "";
        for (const [index, musicInfo] of serverQueue.songs.entries()) {
            if (index === 0) {
                textContent = textContent.concat(`${index} - **${musicInfo.title}** (rodando agora)\n`);
            } else {
                textContent = textContent.concat(`${index} - ${musicInfo.title}\n`);
            }
        }

        await serverQueue.textChannel.send(textContent);
        return;
    } else {
        await message.channel.send("Comando inválido!");
        return;
    }
}

const setupDiscordClient = (client, config, serversQueues) => {
    const date = new Date();

    client.once("ready", () => console.log(`> Bot em execução ${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getMilliseconds()}`));
    client.once("reconnecting", () => console.log("> Reconectando"));
    client.once("disconnect", () => console.log("> Desconectado"));

    client.on("message", (message) => onMessage(message, serversQueues, config, client));
}

module.exports = setupDiscordClient;