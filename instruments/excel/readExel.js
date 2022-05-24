import Excel from 'exceljs'
import createObjectToSave from './createObjectToSave.js';

export default async function read(path,database) {

    let arrPromise = [];

    try {
        let workbook = new Excel.Workbook();

        let dataPath = database.getPathToFile();

        await workbook.xlsx.readFile(`${dataPath+path}.xlsx`);
        let i = 0;

        for (let name of workbook.worksheets) {
            if (!i) {

                let ws = name;
                let days = startAndEnd(ws);
                if (!days) break;
                let groups = findGroups(ws);
                if (!groups) break;
                let groupArr = createObjectToSave(ws,days,groups);

                for (let j = 0;j < groupArr.length;j++)
                    arrPromise.push(await database.save(groupArr[j]));
                i++;
            }
            else 
                break
        }
    }
    catch (e) {
        console.log(e)
    }
    finally {
        return Promise.all(arrPromise).then(()=> {
            return Promise.resolve()},(reject) => {
                console.log(reject);
                Promise.resolve()
                });
    }

}

function startAndEnd(ws) {
    let findDays = findPosition(ws,'понедельник');
    if (findDays == 0)
        return null
    return searchRowInColumn(ws,...findDays)
}

function findGroupsRow(ws) {
    let findDays = findPosition(ws,'день недели');
    if (findDays == 0)
        return null
    return findDays[1]
}

function findGroups(ws) {
    let row = findGroupsRow(ws);
    let array = ws.getRow(row).values;
    let res = [];

    for (let i = 0; i<array.length; i++)
    {
        if (typeof(array[i])==='string' && findNameOfGroup(array[i]))
            res.push([array[i].trim(),i])
    }
    return res
}

function findNameOfGroup(str) {
    if ((str.match(/-/g) || []).length<2)
        return false
    if ((str.match(/[А-Я]/g) || []).length<4)
        return false
    if ((str.match(/[0-9]/g) || []).length<4)
        return false    
    return true

}

function findPosition(ws,str) {
    let Ncolumn = 1;
    let rowStart;
    while ((!(rowStart = searchColumn(ws,Ncolumn,str))) || Ncolumn>10) 
    {
        Ncolumn++;
    }
    if (Ncolumn>10)
        return 0
    return [Ncolumn,rowStart]
}

function searchColumn(ws,column,word) {
    let array = ws.getColumn(column).values;
    for (let i = 0; i < array.length;i++)
    {   
        if (typeof(array[i])!='string')
            continue

        let str = (array[i]).toLowerCase();
        if (str == word)
            return i
    }
    return null
}

function searchRowInColumn(ws,column,start) {
    let array = ws.getColumn(column).values;
    let timeBegin = ws.getColumn(column+2).values;
    let timeEnd = ws.getColumn(column+3).values;
    let result = [];
    let odd = false;
    let numberOfObject = 1;
    let day = array[0];

    for (let i = start; i < array.length;i++)
    {
        if (day!=array[i])
                {
                numberOfObject = 1;
                day = array[i];
                }
        else if (numberOfObject>8) {
            continue
        }
            if (!array[i])
                return result
            let time = timeBegin[i] + '—' + timeEnd[i];
            time = time.replace(/-/g,':');
            result.push([i,array[i],numberOfObject,odd,time]);

            odd = !odd;

            if (!odd)
                numberOfObject++

    }
    return result
}

