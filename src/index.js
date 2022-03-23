const Discord = require("discord.js");
const setupDiscordClient = require("./controller");
const config = require("./config.js");
const {createMapQueue: createMapServersQueue} = require("./modules/Queue");

const serversQueues = createMapServersQueue();
const client = new Discord.Client();

console.log("Segue o objeto: ");
console.log(config);

setupDiscordClient(client, config, serversQueues);

client.login(config.token);