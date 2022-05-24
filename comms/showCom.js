import showData from '../instruments/show/showData.js';
//import createOutput from '../instruments/show/createOutput.js';
import textOutput from '../instruments/show/TextOutput.js'

export default function(db,args) {
    
        return showData(db,args.join(' ').toLowerCase())
            .then(
                (resolve) => 
                {   
                    if (Array.isArray(resolve))
                        return Promise.reject(resolve)
                    return textOutput(resolve)},

                (reject) => {
                    console.log(reject);
                    throw new Error('Чтение БД')
                })
            .then(
                (resolve) => {
                    if  (Array.isArray(resolve))
                        return resolve
                    throw new Error('Не удалось обработать данные')},
                (reject) => {
                    if  (Array.isArray(reject))
                        {return Promise.reject(reject)}
                    else {
                    console.log(reject);
                    throw new Error('Обработка данных из бд')}})
            .catch((e) => Promise.reject(e));
}