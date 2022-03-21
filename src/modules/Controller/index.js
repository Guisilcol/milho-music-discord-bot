const { createQueue, createMapQueue } = require("./../Queue/");
const youtubeService = require("./../../services/Youtube");

/**
 * 
 * @param {import("discord.js").Client} client 
 * @param {import("./../../config")} config
 */
const execute = (client, config) => {
    const serversQueues = createMapQueue();

    client.once("ready", () => {
        console.log("> Bot em execução!");
    });

    client.once("reconnecting", () => {
        console.log("> Reconectando!");
    });

    client.once("disconnect", () => {
        console.log("> Desconectado!");
    });


    client.on("message",

        /**
         * @description Toda mensagem enviada em canais de texto serão capturadas por essa função para análise e execução do bot
         * @param {import("discord.js").Message} message 
         */
        async message => {

            /*
                Trecho de validação de dados
            */

            //Foi o bot que enviou?
            if (message.author.bot) return;
            //Nao e um comando do bot?
            if (!message.content.startsWith(config.prefix)) return;

            const serverQueue = serversQueues.get(message.guild.id) === undefined
                ? createQueue(message.channel, message.member.voice.channel, message.guild)
                : serversQueues.get(message.guild.id);

            //Usuario nao esta conectado no canal de voz?
            if (serverQueue.voiceChannel === null) {
                await message.channel.send("Para executar essa ação, se conecte a algum canal de voz!");
                return;
            }

            const permissions = serverQueue.voiceChannel.permissionsFor(message.client.user);
            //O bot tem permissão de entrar em sala e falar?
            if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
                await message.channel.send(
                    "Preciso de permissão para entrar e tocas musicas nos canais de voz!"
                );
                return;
            }

            //A guild esta na fila principal?
            if (serversQueues.get(message.guild.id) === undefined){
                serversQueues.set(serverQueue.guild.id, serverQueue);
            }

            /*
                Trecho especificando os comandos do bot
            */

            const args = message.content.split(" ");

            if (message.content.startsWith(`${config.prefix} play `)) {
                const song = await youtubeService.getMusicInfo(args[2]);
                
                //E um link do youtube?
                if (youtubeService.isYoutubeLink(song.url)) {
                    //O bot já esta conectado a sala de voz?
                    if (serverQueue.connection === null) {
                        try {
                            serverQueue.connection = await serverQueue.voiceChannel.join();
                            serverQueue.songs.push(song);
                            await youtubeService.play(serverQueue.guild, serverQueue.songs[0], serversQueues);

                        } catch (error) {
                            console.log(error);
                            serversQueues.delete(serverQueue.guild.id);
                            await serverQueue.textChannel.send(error)
                            return;
                        }

                    } else {
                        serverQueue.songs.push(song);
                        message.channel.send(`${song.title} foi adicionado na fila!`);
                        return;
                    }
                }
            } else if (message.content.startsWith(`${config.prefix} skip `)) {
                youtubeService.skip(message, serverQueue);
            } else if (message.content.startsWith(`${config.prefix} stop `)) {
                
            } else {
                message.channel.send("Comando inválido!");
            }
    });
}


module.exports = execute;