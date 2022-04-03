const Discord = require("discord.js");
const http = require("http");
const setupDiscordClient = require("./controller");
const config = require("./config.js");
const {createMapQueue: createMapServersQueue} = require("./modules/Queue");

const serversQueues = createMapServersQueue();

const client = new Discord.Client();

setupDiscordClient(client, config, serversQueues);
client.login(config.token);

//Criação de um endpoint pro Heroku, para que não haja problemas ao acessar o host do bot
http.createServer((_, response) => response.end())
    .listen(process.env.PORT || 6000);