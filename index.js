const Discord = require("discord.js");

const config = require("./config.json");

const client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES"]});

const prefix = "!";

client.on("messageCreate", function(message) { 
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(' ');
  const command = args.shift().toLowerCase();
  if (command === "птн") {
    const timeTaken = Date.now() - message.createdTimestamp;
    message.reply(`пнх`);
  }   

  else if (command === "sum") {
    const numArgs = args.map(x => parseFloat(x));
    const sum = numArgs.reduce((counter, x) => counter += x);
    message.reply(`The sum of all the arguments you provided is ${sum}!`);
  }
                                         

});                                      

client.login(config.BOT_TOKEN);