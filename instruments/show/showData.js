export default async function showData(db,data) {
    console.log(data)
    try {
        if (!data)
        throw new Error('Нет данных в качестве аргументов')
        
        return db.getName(data).then( 
            (groupName) => {
                if (Array.isArray(groupName))
                    {
                        if (groupName.length === 0)
                            throw Error('Нет совпадений')
                        return groupName
                    }
                return db.getShedule(groupName)
            },
            (reject) => {
                throw Error(reject)
                }
        )
    }
    catch (e)
    {  
        return Promise.reject(e);
    }

}