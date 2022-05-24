export default async function showData(object) {

    try {
        let oddWeek = [];
        let week = [];

        for (let i = 0; i<object.length;i++)
        {   

            if (!object[i] || object[i].created===false || emptyShedule(object[i]))
                continue
                
            (object[i].odd) ? oddWeek.push(object[i]): week.push(object[i]);   
        }

        let title = `**Расписание ${object.name}**\n`

        let res = Structure(week,oddWeek,title,object.dataType)
        return Promise.resolve(res)
    }
    catch (e)
    {   console.log(e)
        return Promise.reject(e);
    }
}

function emptyShedule(obj) {
    return (!obj.lesson && !obj.type && !obj.teacher && !obj.room)
}

function chekfields(obj) {

    if (!obj.lesson || obj.lesson === 'undefined')
        obj.lesson = '-';
    if (!obj.type || obj.type === 'undefined')
        obj.type = '';
    if (!obj.teacher || obj.teacher === 'undefined')
        obj.teacher = '-';
    if (!obj.room || obj.room === 'undefined')
        obj.room = '-';
}

function Structure(less,lessOdd,title,type) {

    let wordDeppend; 

    (type == "teacher") ? wordDeppend = 'Группа':
                        wordDeppend = 'Преподаватель';

    let result = [];

    let week = analyseShedule(title,less,wordDeppend);
    let oddweek = analyseShedule(title,lessOdd,wordDeppend,true);

    if (!!week.length) result.push(...week)
    if (!!oddweek.length) result.push(...oddweek)

    if (!result.length)
        return [`${title} отсутствует`]

    return result
    
}


function analyseShedule(title,arr,wordDeppend,odd = false) {

    let count = 0;
    let week;
    (odd) ? week = `\n**Нечетная неделя:**\n`:
            week = `\n**Четная неделя:**\n`;

    if (!arr.length)
        return ''

    let dayOfWeek = arr[0].day;

    let resultStr = [];
    let text = "```";

    resultStr[count] = title;

    resultStr[count] += week; 


    for (let shedule of arr)
    {   
        chekfields(shedule);
        if (dayOfWeek != shedule.day) 
        {
            if (resultStr[count].length>1500)
                resultStr[++count] = title;
            resultStr[count]+= `\n${dayOfWeek}\n`+text + "```"

            text = "```";
        }

        text +=`${shedule.num} пара (${shedule.room},${shedule.time})\n`+`${shedule.lesson}  ${shedule.type}\n` + `${wordDeppend}: ${shedule.teacher}\n\n`

        dayOfWeek = shedule.day;
    }

    if (resultStr[count].length>1200)
        resultStr[++count] = title;

    resultStr[count]+= `\n${dayOfWeek}\n`+text + "```"

    return resultStr
}
