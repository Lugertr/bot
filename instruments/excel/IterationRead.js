import read from './readExel.js';

export default async function iterationRead(size,db) {
    
    let arr = [];

    for (let i = 0; i < size;i++)
        {
            arr.push(await read(`file${i}`,db))
        }
    
    return Promise.all(arr).then(()=> Promise.resolve(),
        (reject) => db.changePath().then(()=> Promise.reject(reject)));
}
