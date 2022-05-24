import Discord from "discord.js";
import dotenv from 'dotenv';
import dataBase from './instruments/dataBase/dataBase.js'
import comms_list from './comms/coms.js'

dotenv.config();

const client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES"]});


const prefix = process.env.PREFIX;

let db = new dataBase();
client.login(process.env.DJS_TOKEN);

client.on("messageCreate", function(message) { 

  if (message.author.bot) {
    try {

      if (message.content.startsWith('По запросу')){

        const filter = i => i.user.id === message.mentions.repliedUser.id;

        const collector = message.channel.createMessageComponentCollector({filter, time: 15000 });

        collector.on('collect', async i => {
        if (i.customId !== 'end') {

          message.channel.messages.fetch(message.reference.messageId).then((resolve)=>{
            comms_list[comms_list.length-1].out(resolve,db,[i.customId])})
          //i.update({ content: 'Начинается поиск..', components: [] });
          message.delete()
      }
      else
        i.update({ content: 'Поиск отменяется...', components: [] });
      });
      
      collector.on('end', (count) => {
        if (!count)
          message.delete()
      });

      }
      else if (!message.content.startsWith('**Расписание'))
      {
        setTimeout(() => message.delete(), 15000)
      }
    }
    catch (e) {
      console.log(e)
    }
    finally {
      return
    };
  };

  if (!message.content.startsWith(prefix)) return;

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(' ');
  const command = args.shift().toLowerCase();

  for (let counter in comms_list) 
  {
    if (command === comms_list[counter].name)
      {
        comms_list[counter].out(message,db,args)
      }
  }                    
}); 
