//const config = require('config.json');
//import Discord from "discord.js";

import showData from '../instruments/show/showData.js';
import createOutput from '../instruments/show/createOutput.js';
import download from '../instruments/opDownload/download.js';
import iterationRead from '../instruments/excel/iterationRead.js';


const prefix = process.env.PREFIX;
//const versions = config.versions;


// Команды //

function test(mess) {
  mess.channel.send("Тест!")
}

function downloadShedule(message,db) {

  db.changePath()
    .then(() => db.clearData())
    .then(() => download(db))
  //new Promise(resolve=>resolve(60))
    .then((resolve) => {message.reply('Идет обновление расписания...');
      return iterationRead(resolve,db)},

      (reject) => {console.log(reject);
        throw new Error('Не удалось загрузить новое расписание')})

    .then(()=>{message.reply('База данных обновлена');},
          
      (reject) => {console.log(reject);
        throw new Error('Не удалось сформировать новое расписание')})

    .catch( () => message.reply('Не удалось обновить расписание'));
}

function showShedule(message,db,args) {

  if (args.length<1) {
    message.reply('Введите название группы')

  }
  else  {
    message.reply('Идёт поиск...')
    showData(db,args.join(' '))

    .then(
      (resolve) => createOutput(resolve),
      (reject) => {
        console.log(reject);
        throw new Error('Чтение БД')
        }
    )
    .then(
      (resolve) => {
        console.log(resolve)
//message.reply(resolve)
        //const embed = new MessageEmbed()
          //.setTitle('Обновлено 15.04.2022')
        //console.log(resolve)
        //for (let lesson of resolve)
       // {
        //  embed.addFields(lesson)
        //}
        //message.reply({embeds:[embed]})
        for (let lessons of resolve)
        {
         message.reply(lessons)
        }
      }, 
      (reject) => {
      console.log(reject);
      throw new Error('Обработка данных из бд')
      })
    .then(
      ()=> {}
    )

    .catch(() => message.reply('Пользователь не найден'));
  //db.get({name:'ЭЛБО-02-19'}).then((resolve)=>{
  }
}


// Список комманд //

export default [{
    name: "test",
    out: test,
    about: "Тестовая команда"
  },
  {
    name: "обновить",
    out: downloadShedule,
    about: "Команда для обновления расписания!"
  },
  {
    name: "показать",
    out: showShedule,
    about: "Команда для вывода расписания группы"
  }
]
