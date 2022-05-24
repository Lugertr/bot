export default function(ws,days,Arrgroups) {
     //let tabSize = groups[0]
     let tabSize = 3;
     let result = [];
 
     for (let Onegroup of Arrgroups) {
 
         let groupName = Onegroup[0].toLowerCase();
 
         if (!Onegroup)
             continue
 
         let groups = {
             
         }
 
         let group = groups[groupName] = {
             name: Onegroup[0],
             length: days.length,
             dataType: "group",
         }
 
         let teachers = {
             
         }
 
         for (let i = 0; i < days.length;i++)
         {
             let row = days[i][0];
             let lessons = getInfoFromExcel(ws,row,Onegroup[1],Onegroup[1]+tabSize);
 
             group[i] = {
                 day: days[i][1],
                 num: days[i][2],
                 odd: days[i][3],
                 time: days[i][4],
                 lesson: lessons[0],
                 type:lessons[1],
                 teacher: ``,
                 room: lessons[3]
             }
 
             let arrOfTeachers = onlyObjOrStr(lessons[2]);
 
             if (!arrOfTeachers) 
                 continue
 

             for (let teacher of arrOfTeachers) 
             {
                 group[i].teacher += `${teacher}, `

                 let teacherN = teacher.toLowerCase()
 
                 if (!teachers[teacherN]) {
                     teachers[teacherN] = 
                     {   
                         name: teacher,
                         dataType: "teacher",
                         length: days.length
                     }
                     for (let j = 0;j<days.length;j++)
                     {
                         teachers[teacherN][j]={
                             created: false, 
                             day: days[j][1],
                             num: days[j][2],
                             odd: days[j][3],
                             time: days[i][4],}
                     }
                 }
             
                 if (!!teachers[teacherN][i].created) 
                 {
                     teachers[teacherN][i].teacher += `, ${Onegroup[0]}`;
                 }
                 else
                 {   
                     teachers[teacherN][i] = {
                         day: days[i][1],
                         num: days[i][2],
                         odd: days[i][3],
                         time: days[i][4],
                         lesson: lessons[0],
                         type:lessons[1],
                         teacher : `${Onegroup[0]}`,
                         room: lessons[3],
                         created: true};
                 }}
 
         }
         //result.push(group);
         result.push(groups,teachers);
     }
     //console.log(...result)
     return result
     //сохранение в бд
}

function onlyObjOrStr(str) {
    try {
    if (typeof(str)==='string')
        {   
            str = str.replace(/,/g,'.').replace("..", ".")
            str = str.split('\n').filter(function(item, pos) {
                return str.indexOf(item) == pos;
            })
            return str.map(item => item.trim());

        }
    else if (typeof(str)==='object')
        {   
            let arr = str.richText;

            if (arr) {
                let text = '';
                for (let part of arr) {
                    let property = part.text;
                    if (typeof(property)==='string')
                        text += property;
                }
                if (!text) return false

                return text.split('\n').map(item => item.trim());
            }
            return false
        }
    else 
        return false
    }
    catch (e)
        {
            console.log(e)
            return false
        }
}

function getInfoFromExcel(ws,row,Cstart,Cend) {
    let line = ws.getRow(row).values;
    let res = [];
    for (let i = Cstart; i<= Cend;i++)
    {
        res.push(line[i]);
    }
    return res
}