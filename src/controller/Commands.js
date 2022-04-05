const Validation = require('./Validation');
const Queue = require("./../modules/Queue");
const Service = require("./../services")
const MediaPlayer = require("./../modules/MusicPlayer");

/**
 * 
 * @param {import("discord.js").Message} message 
 * @param {import("discord.js").TextChannel} textChannel 
 * @param {import("./../modules/Queue").serversQueues} serversQueues 
 */
const play = async (message, textChannel, serversQueues) => {
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

        //Não há uma fila criada?
        if(serversQueues.get(message.guild.id) === undefined){
            const voiceChannel = message.member.voice;

            const connection = await message.member.voice.channel.join();

            const guild = message.guild;

            const serverQueue = Queue.createQueue(
                textChannel, voiceChannel, guild, connection)

            serversQueues.set(serverQueue.guild.id, serverQueue);
        }else{
            const voiceChannel = message.guild.voice;

            const connection = message.guild.voice.connection;
    
            const guild = message.guild;

            const serverQueue = serversQueues.get(message.guild.id);

            serverQueue.voiceChannel = voiceChannel;
            serverQueue.connection = connection;
            serverQueue.guild = guild;

            serversQueues.set(serverQueue.guild.id, serverQueue);
        }

        const serverQueue = serversQueues.get(message.guild.id);
        
        const args = message.content.split(" ");
        const url = args[2];
        const musicInfoFromCommand = await Service.setMusicInfoWithService(url);

        serverQueue.songs.push(musicInfoFromCommand);
        /*
            ************* ARRUMAR O FATO DO BOT  NÃO ESTAR FUNCIOANDNO COM ALGUMAS MUSICAS 
            ************* A FILA NÃO PODE PARAR POR COMPLETO QUANDO UMA MUSICA QUE NAO FUNCIONA É INFORMADA
        */
        if (!serverQueue.playing) {
            serverQueue.playing = true;

            while (serverQueue.songs[0] !== undefined) {
                try {
                    const musicInfo = serverQueue.songs[0];
                    const music = await Service.youtube.getMusic(musicInfo.url)
                        .catch(error => {
                            throw new Error("Não foi possivel capturar a música informada")
                        });
    
                    await serverQueue.textChannel.send(`Corno broxa ta tocando isso aqui agora: **${musicInfo.title}**`);
                    await MediaPlayer.play(serverQueue, music)
                        .catch(error => {
                            throw new Error("Ocorreu um erro ao tocar a musica")
                        });
                    serverQueue.songs.shift();
                } catch (error) {
                    console.error(error)
                }
            }

            serverQueue.playing = false;

            serverQueue.connection.disconnect();
            serversQueues.delete(serverQueue.guild.id);
            return;

        } else {
            await message.channel.send(`${musicInfoFromCommand.title} foi adicionado na fila!`);
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
}

/**
 * 
 * @param {import("discord.js").Message} message 
 * @param {import("discord.js").TextChannel} textChannel 
 * @param {import("./../modules/Queue").serversQueues} serversQueues 
 */
const skip = async (message, textChannel, serversQueues) => {
    const serverQueue = serversQueues.get(message.guild.id);
    if(serverQueue === undefined || serverQueue.songs.length === 0){
        await textChannel.send("DESGRAÇADO não tem musica pra skipar");
        return;
    }
    await MediaPlayer.skip(serverQueue);
}

/**
 * 
 * @param {import("discord.js").Message} message 
 * @param {import("discord.js").TextChannel} textChannel 
 * @param {import("./../modules/Queue").serversQueues} serversQueues 
 */
const stop = async (message, textChannel, serversQueues) => {
    const serverQueue = serversQueues.get(message.guild.id);
    if(serverQueue === undefined || serverQueue.songs.length === 0){
        await textChannel.send("DESGRAÇADO burro não tem o que dar stop");
        return;
    }
    await MediaPlayer.stop(serverQueue);
}

/**
 * 
 * @param {import("discord.js").Message} message 
 * @param {import("discord.js").TextChannel} textChannel 
 * @param {import("./../modules/Queue").serversQueues} serversQueues 
 */
const queue = async (message, textChannel, serversQueues) => {
    const serverQueue = serversQueues.get(message.guild.id);
    if (serverQueue === undefined){
        await textChannel.send("Imbecil, inicia alguma coisa no bot");
        return;
    }
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
}

module.exports = {
    play,
    skip,
    stop,
    queue
}