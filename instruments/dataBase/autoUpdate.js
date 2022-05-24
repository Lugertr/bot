import downloadCom from "../../comms/downloadCom.js";

export default function(date,db) {
    const DateNow = new Date();

    if ((DateNow-date) > 1296000000n)
    {
        console.log('Расписание не обновлялось больше двух недель, началось обновление расписания')
        downloadCom(db).then(()=>console.log('Обновление расписания завершено'))
    }
}