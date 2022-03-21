/**
 * 
 * @param {import("discord.js").Message} message 
 * @param {import("./../../modules/Queue").Queue} serverQueue 
 * @returns 
 */
const skip = (message, serverQueue) => {
  if (!message.member.voice.channel)
    return message.channel.send(
      "Entra em um canal de voz pra skipar a música caraio"
    );
  if (serverQueue.songs.length === 0)
    return message.channel.send("Ta skipando o que corno não tem música");
  serverQueue.connection.dispatcher.end();
}

module.exports = skip;