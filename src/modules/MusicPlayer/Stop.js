/**
 * 
 * @param {import("./../../modules/Queue").Queue} serverQueue 
 * @returns 
 */
 const stop = async (serverQueue) => {
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
    /*
    if (!message.member.voice.channel)
      message.channel.send(
        "Entra em um canal de voz pra skipar a música caraio"
      );
    if (serverQueue.songs.length === 0)
      return message.channel.send("Ta skipando o que corno não tem música");
    */
   
  }
  
  module.exports = stop;