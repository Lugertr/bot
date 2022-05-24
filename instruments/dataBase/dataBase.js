import fs from 'fs'
import fsPromises from 'fs/promises'
import https from 'https'

import autoUpdate from './autoUpdate.js'

export default class dataBase {

    pathPar = `storage/par.json`


    constructor() {                                             //Инициализация базы данных
        this.par = JSON.parse(fs.readFileSync(this.pathPar));   //Получение состояния базы данных из файла с параметрами (storage/par.json)
        if (!this.par || Object.keys(this.par).length === 0)
            this.init().then(()=>{this.PathAndUpdate()});
        else
            this.PathAndUpdate()
    }

    async init() {
        this.setPath();
        console.log('database absulutly clear')
        return this.clearData().then(()=>this.changePath())
            .then(()=> this.clearData());
    }

    PathAndUpdate() {
        this.setPath();                                         //Инициализация вспомогательных параметров
        autoUpdate(this.par.date,this)
        console.log('db connected')
    }

    setPath() {
        (this.par.backupUse) ? (this.path = `storage/infoBackup/`,                  //Определения путей к используемым файлам
                                this.pathName = 'storage/names/namesBackup.json', 
                                this.count = this.par.countBackup,
                                this.pathFile = `storage/filesBackup/`,
                                this.size = this.par.fileSizeBackup)
                            :
                                (this.path = `storage/information/`, 
                                this.pathName = 'storage/names/names.json',
                                this.count = this.par.count,
                                this.pathFile = `storage/files/`,
                                this.size = this.par.fileSize);
    }

    async changePath() {
        this.par.backupUse = !this.par.backupUse;
        console.log(`use backup: ${this.par.backupUse}`)
        this.setPath();
        return this.saveInFile(this.pathPar,JSON.stringify(this.par))
    }


    updateCountandSize() {
        (this.par.backupUse) ?  (this.par.countBackup = this.count,
                                this.par.fileSizeBackup = this.size)
                                :
                                (this.par.count = this.count,
                                this.par.fileSize = this.size) 

        this.par.date = new Date();
    }


    async updatePar() {
        this.updateCountandSize();
        return this.saveInFile(this.pathPar,JSON.stringify(this.par))
    }

    ///////////////////////////////////////////////////////////

    async getName(key) {
        return this.getInfo(this.pathName,key,true);
    }    

    async getShedule(numb) {
        if (!numb && numb!==0)
            return Promise.reject()
        let savePath = this.path + `shedule${numb}.json`
        return this.getInfo(savePath,0);
    }

    async getInfo(path,key,nameGroup = false) {
        return this.readFile(path).then(data => {
            data = JSON.parse(data);
            if (data.hasOwnProperty(key))
                return Promise.resolve(data[key])
            else if (nameGroup)
                return Promise.resolve(this.findSimilar(key,data))
            return Promise.reject('ошибка поиска')
        })
    }

    findSimilar(str,obj) { 

        let result = [];
    
        if (obj.hasOwnProperty(str))
        {
            result.push(str)
        }
        else {
            for (let property in obj)
            {
                if (property.includes(str))
                    result.push(property)
                
                if (result.length>=4)
                    break;
            }
        }
        return result
    }

/////////////////////////////////////////////////////////////////////////////////////////////

    async clearData() {             // удаления информации в базе данных
        let arrPromise = [];

        for (let i = 0; i < this.size; i++)
        {
            try {
            let clearPath = this.pathFile + `/file${i}.xlsx`;
            arrPromise.push(await this.clear(clearPath))}
            catch(e) {
                console.log('a')
                console.log(e)
                continue
            }
        }

        this.size = 0;


        for (let i = 0; i < this.count; i++) 
        {
            try {
            let clearPath = this.path + `/shedule${i}.json`;
            arrPromise.push(await this.clear(clearPath))}
            catch(e) {
                console.log('b')
                console.log(e)
                continue
            }
        }

        this.count = 0;

        arrPromise.push(await this.saveInFile(this.pathName,JSON.stringify({})))
        
        return Promise.all(arrPromise).then(()=>
            this.updatePar())
    }

    async clear(path) {
        return fsPromises.unlink(path, (err) => {
            if (err) Promise.reject(err);})
    }

    ///////////////////////////////////////////////////////////////////////////////////

    async createFile(url,count) {
        return new Promise(resolve => {
            let file = fs.createWriteStream((this.pathFile + `/file${count}.xlsx`));
            https.get(url, function(response) 
            {
                response.pipe(file);
                response.on('end', ()=> {resolve()})
            })
        this.size++
        })
    }
    
    /////////////////////////////////////////////////////

    getPathToFile() {
        return this.pathFile 
    }

    async save(obj) {

        let groups = this.findObjectInside(obj);
        if (!groups.length)
        {
            return Promise.resolve()
        }

        let arrReadFile = [];   

        for (let group of groups)
        {
            arrReadFile.push(await this.addSaveData(group,obj))
        }

        return Promise.all(arrReadFile).then(()=> 
            this.updatePar());
    }

    
    findObjectInside(obj) {
        let arr = [];
        for (let ell in obj)
            {
                if (ell)
                    arr.push(ell)
            }
        return arr
    }

    async analyseSaveData(group,obj) {

        return this.readFile(this.pathName).then(                       // проверка если в файле names.json группа или преподаватель
            (nameData) => {
                nameData = JSON.parse(nameData);
                let savePath;
                let data;

                if (!nameData.hasOwnProperty(group)) {                      // если группа или преподаватель отсутствует
                    nameData[group] = this.count;                           //Создаем файл с расписанием и добавляем в файл names.json группу или преподавателя
                    savePath = this.path + `/shedule${this.count++}.json`;
                    data = {name: group,
                    count: 0}
                    data[0] = obj[group];  
                }
                else {
                    savePath = this.path + `shedule${nameData[group]}.json`
                    return this.readFile(savePath).then((data) =>
                {
                    data = JSON.parse(data);
                    if (nameData[group].dataType==="group")
                        data[++data.count] = obj[group];
                    else
                        {   
                        let length = data[data.count].length;
                            //data[data.count] = Object.assign(data[data.count],obj[group])
                        for (let propery in obj){
                            if (obj[propery].created) {
                                delete obj[propery].created;
                                data[data.count][propery] = obj[propery];
                            }
                        }
                        if (data[data.count].length < length)
                            data[data.count].length = length;
                        }
                    return Promise.resolve([data,savePath,nameData])
                });
            }
            return Promise.resolve([data,savePath,nameData])
        })}

    async addSaveData(group,obj) {

        return this.analyseSaveData(group,obj).then(([data,path,nameData])=> {
            if (!data || !path || !nameData)
                return Promise.reject(e)

            let arrSave = [this.saveInFile(path,JSON.stringify(data)),
                this.saveInFile(this.pathName,JSON.stringify(nameData))];
    
            return Promise.all(arrSave).then(()=> {
                return Promise.resolve()});        
        })
    }

    async readFile(path) {
        return fsPromises.readFile(path);
    }

    async saveInFile(path,data) {
        return fsPromises.writeFile(path, data)
    }
}