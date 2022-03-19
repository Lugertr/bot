import Discord from "discord.js";
//import config from "./config.js";
import download from './instruments/download.js';
import read from './instruments/readExel.js';

const client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES"]});

const prefix = "!";

client.on("messageCreate", function(message) { 
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(' ');
  const command = args.shift().toLowerCase();
   if (command === "sum") {
    const numArgs = args.map(x => parseFloat(x));
    const sum = numArgs.reduce((counter, x) => counter += x);
    message.reply(`The sum of all the arguments you provided is ${sum}!`);
  }
                                         

});                                      

client.login(process.env.DJS_TOKEN);