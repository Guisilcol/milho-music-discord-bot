const Discord = require("discord.js");
const setupDiscordClient = require("./controller");
const config = require("./config.js");
const {createMapQueue: createMapServersQueue} = require("./modules/Queue");
const http = require("http");

const serversQueues = createMapServersQueue();
const client = new Discord.Client();

setupDiscordClient(client, config, serversQueues);

client.login(config.token);

http.createServer(() => console.log("> Heroku: ping feito com sucesso")).listen(process.env.PORT || 6000);