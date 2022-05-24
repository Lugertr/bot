import downloadCom from './downloadCom.js';
import showCom from './showCom.js';
import {MessageActionRow, MessageButton} from "discord.js";

const prefix = process.env.PREFIX;

let dbUpdating = false;

const FAO = `
Установить бота возможно, перейдя по ссылке <https://discord.com/api/oauth2/authorize?client_id=946189599254913034&permissions=0&scope=bot>.
Для использования бота достаточно ввести в чат одну из трех команд:
-	Обновить расписание (команда «!обновить»)
-	Вывести расписание группы или преподавателя (команда «!показать (название группы или ФИО преподавателя)»)
-	Вывести руководство пользователя (команда «!справка»)
Команды «!обновить» и «!показать» выведут результат в чат, где команда была написана, команда «!справка» отправит пользователю личное сообщение в мессенджере.
`

// Команды //

function test(message) {


  message.author.send({content:FAO})
}

function downloadShedule(message,db) {

    if (dbUpdating) 
      message.reply({ content: 'Подождите, расписание обновляется.',ephemeral:true})
    else {
      dbUpdating = true;
      message.reply({ content: 'Начался процесс обновления расписания...',ephemeral:true})
        .then(()=> downloadCom(db))
        .then(()=> {
          dbUpdating = false;
          message.reply({ content: 'Обновление расписания прошло успешно.',ephemeral:true})},
            (e)=> {
                dbUpdating = false;
                console.log(e);
                message.channel.send({content : 'Не удалось обновить расписание.',ephemeral:true})})
  }
}

function showShedule(message,db,args) {

  if (dbUpdating)
    message.reply({ content: 'Подождите, расписание обновляется.',ephemeral:true})

  else if (args.length<1) 
    message.reply({ content: 'Введите название группы.',ephemeral:true})

  else  {
    try {
    message.reply({ content: 'Идёт поиск...',ephemeral:true})
        .then(()=>showCom(db,args))
        .then(
            (resolve)=> {
                for (let lessons of resolve)
                    {
                       if (typeof(lessons)==='string')
                       message.reply(lessons)
                    }},
            (reject) => {
              if  (Array.isArray(reject))
                {
                  try {

                    let buttonArr = [];

                      for (let names of reject) {
                        const row = new MessageActionRow()
			                    .addComponents(
				                  new MessageButton()
					                .setLabel(names)
                          .setCustomId(names)
					                .setStyle('PRIMARY'),);

                          buttonArr.push(row)
                      }

                      const cancelButton = new MessageActionRow()
                      .addComponents(
                      new MessageButton()
                      .setLabel('Отмена')
                      .setCustomId('end')
                      .setStyle('DANGER'),);

                      buttonArr.push(cancelButton)

                      message.reply({ content: 'По запросу найдены следующие расписания:', components: buttonArr,ephemeral:true });
                  }
                  catch (e) {
                    console.log(e);
                    message.channel.send({ content: 'Не удалось найти расписание.',ephemeral:true})
                  }
                }
              else {
                console.log(reject);
                message.channel.send({ content: 'Не удалось найти расписание.',ephemeral:true})}})
      }
  catch(e) {
      console.log(e)
      message.channel.send({ content: 'Не удалось найти расписание.',ephemeral:true});
    }
  }
}


// Список комманд //

export default [{
    name: "справка",
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
