const Validation = require("./Validation");
const MediaPlayer = require("./../modules/MusicPlayer");
const Commands = require("./Commands");



/**
* @description Toda mensagem enviada em canais de texto serão capturadas por essa função para análise e execução do bot
* @param {import("discord.js").Message} message
* @param {import("./../modules/Queue").serversQueues} serversQueues
* @param {import("./../config")} config
*/
const onMessage = async (message, serversQueues, config) => {

    /* 
        TRECHO DE VALIDACAO
    */

    if (Validation.isABotTheAuthor(message)) return;
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
    const textChannel = message.channel;
    const content = message.content;
    const prefix = config.prefix;
    
    if (content.startsWith(`${prefix} play `)) {
        await Commands.play(message, textChannel, serversQueues);
    
    } else if (content.startsWith(`${prefix} skip`)) {
        await Commands.skip(message, textChannel, serversQueues);

    } else if (content.startsWith(`${prefix} stop`)) {
        await Commands.stop(message, textChannel, serversQueues);

    } else if (content.startsWith(`${prefix} queue`)) {
        await Commands.queue(message, textChannel, serversQueues)
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