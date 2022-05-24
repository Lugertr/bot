import needle from 'needle'

export default async function download(db) { 

let URL = 'https://www.mirea.ru/schedule/';

return needle("get",URL).then(
    function(res,err) {
        if (err) throw err;
        return res.body;})

    .then((resolve)=> getURL(resolve))
    .then((resolve)=> create(resolve,db))

    .catch(err => {console.log(err);
        return db.changePath().then(()=>Promise.reject(err))})

}

async function getURL(text) {

    let count = 0;
    let i = 0;
    let t = 'https://webservices.mirea.ru/';
    let arrayUrl = [];

    while ((i = text.indexOf('href="https://webservices.mirea.ru/',i)) != -1)
    {
        i+=34;
        let str = '';
        while (text[i+1]!='"')
        {
            i++;
            str +=text[i];
        }
        if (str.indexOf('xlsx') != -1)
        //arrayUrl.push([encodeURI(t+str),count]);
        arrayUrl.push(encodeURI(t+str));
        count++;
    }
    return Promise.resolve(arrayUrl)
}

async function create(arrUrl,db) {
    let count = 0;
    let arrFunc = [];
    
    for (; count < arrUrl.length; count++)
        arrFunc.push(await db.createFile(arrUrl[count],count))
    return Promise.all(arrFunc).then(()=> Promise.resolve(count));
}



