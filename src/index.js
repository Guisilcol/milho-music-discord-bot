const Discord = require("discord.js");
const execute = require("./modules/Controller");
const config = require("./config.js");

const client = new Discord.Client();

execute(client, config);

client.login(config.token);