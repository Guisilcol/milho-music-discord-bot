const stop = (message, serverQueue) => {
    if (!message.member.voice.channel)
        return message.channel.send(
            "Entra em um canal de voz pra parar a musica filho da puta!"
        );

    if (!serverQueue)
        return message.channel.send("Ta pausando o que corno não tem música");

    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
}

module.exports = stop;