import download from '../instruments/opDownload/download.js';
import iterationRead from '../instruments/excel/iterationRead.js';

export default async function(db) {
    return db.changePath()
    //return new Promise(resolve=>resolve(5))
    .then(() => db.clearData())
    .then(() => download(db))
    .then(
        (resolve) => iterationRead(resolve,db),

        (reject) => {console.log(reject);
            throw new Error('Не удалось загрузить новое расписание')})

    .then(
        (resolve)=> resolve,
          
        (reject) => {console.log(reject);
            throw new Error('Не удалось сформировать новое расписание')})

    .catch( (e) => Promise.reject(e));
}