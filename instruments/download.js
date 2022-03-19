import needle from 'needle'
import https from 'https'
import fs from 'fs'


export default function download() { 

let URL = 'https://www.mirea.ru/schedule/';

needle.get(URL, function(res,err) {
    if (err) throw err;
    let text = res.body;
    getURL(text);
    create(text);
});
}

function getURL(text) {

    let i = 0;
    let t = 'https://webservices.mirea.ru/';

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
        arrUrl.push(encodeURI(t+str));
    }
}

function create() {
    for (let j = 0; j < arrUrl.length; j++)
    {
    let file = fs.createWriteStream(`storage/file${j}.xlsx`);
    https.get(arrUrl[j], function(response) {
        response.pipe(file);
      });
    }
}


