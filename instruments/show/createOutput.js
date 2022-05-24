import columnify from "columnify";

export default async function showData(object) {

    try {
    
        let oddWeek = [];
        let week = [];

        for (let i = 0; i<object.length;i++)
        {
            if (!object[i])
                continue
            
            (object[i].odd) ? oddWeek.push(object[i]): week.push(object[i]);   
        }

        let res = StructureO(week,oddWeek,object.dataType)
        return Promise.resolve(res)

        //oddWeek = Structure(oddWeek)
        //week = Structure(week)
        //let result = outputInfo(object,week,oddWeek)
        return Promise.resolve(result)
    }
    catch (e)
    {   console.log(e)
        return Promise.reject(e);
    }

}

function chekfields(obj) {
    if (!obj.lesson || obj.lesson === 'undefined')
        obj.lesson = '———';
    if (!obj.type || obj.type === 'undefined')
        obj.type = '———';
    if (!obj.teacher || obj.teacher === 'undefined')
        obj.teacher = '———';
    if (!obj.room || obj.room === 'undefined')
        obj.room = '———';
    return obj;
}

function StructureO(less,lessOdd,type) {

    let wordDeppend; 

    (type == "teacher") ? wordDeppend = 'Группа':
                        wordDeppend = 'Преподаватель';
    
    //let size = maxLength(less);
    //let shiftWeek;

    // if (shiftWeek = (less.length<lessOdd.length)) {
    //     let swap = less;
    //     less = lessOdd;
    //     lessOdd = swap;
    // }

    //let text = createTopOfTable(size,[10,8,3,13]);

    let dayOfWeek = less[0].day;
    let result = [];
    let lessonsInOneDay = [];
    let oddLessonsInOneDay = [];

    let text;

    for (let i = 0; i < less.length; i++)
    {
        chekfields(less[i])
        chekfields(lessOdd[i])
        //let length = getLength(less[i]);

        //if (obj.room.length > (length.room))
          //  length.room = obj.room.length;

        if (dayOfWeek != less[i].day) 
        {   
           // if (!shiftWeek) {
                text = `**${dayOfWeek}**\n`+ "```" + `\nНечетная неделя:\n` + columnify(lessonsInOneDay,{columnSplitter: ' | '}) + '\n' + "```"
                text += "```" + `\nЧетная неделя:\n` + columnify(oddLessonsInOneDay,{columnSplitter: ' | '}) + '\n' + "```";
            //}
           // else {
             //   text = `**${dayOfWeek}**\n`+ "```" + `\nЧетные недели:\n` + columnify(lessonsInOneDay,{columnSplitter: ' | '}) + '\n' + "```"
            //    text += "```" + `\nНечетные недели:\n` + columnify(oddLessonsInOneDay,{columnSplitter: ' | '}) + '\n' + "```";}
        
            lessonsInOneDay = [];
            oddLessonsInOneDay = [];
            result.push(text)

            dayOfWeek = less[i].day;

    }

        lessonsInOneDay.push({
            "Номер пары":less[i].num,
            "Предмет": less[i].lesson,
            "Тип": less[i].type,
            [wordDeppend]: less[i].teacher,
            "Аудитория": less[i].room
           //"Предмет": less[i].lesson,
        })
 
        oddLessonsInOneDay.push({
            "Номер пары":lessOdd[i].num,
            "Предмет": lessOdd[i].lesson,
            "Тип": lessOdd[i].type,
            [wordDeppend]: lessOdd[i].teacher,
            "Аудитория": less[i].room
               //"Предмет": less[i].lesson,
        })
      
    }
    
    //if (!shiftWeek) {
        text = `**${dayOfWeek}**\n`+ "```" + `\nНечетная неделя:\n` + columnify(lessonsInOneDay,{columnSplitter: ' | '}) + '\n' + "```"
        text += "```" + `\nЧетная неделя:\n` + columnify(oddLessonsInOneDay,{columnSplitter: ' | '}) + '\n' + "```";
    //}
   // else {
   //     text = `**${dayOfWeek}**\n`+ "```" + `\nЧетные недели:\n` + columnify(lessonsInOneDay,{columnSplitter: ' | '}) + '\n' + "```"
    //    text += "```" + `\nНечетные недели:\n` + columnify(oddLessonsInOneDay,{columnSplitter: ' | '}) + '\n' + "```";}

    result.push(text);

    return result
}
