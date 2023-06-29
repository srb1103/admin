import * as SQLite from 'expo-sqlite'
const db = SQLite.openDatabase('database.db')

export const createTable = ()=>{
    const promise = new Promise((resolve,reject)=>{
        db.transaction(tx=>{
            tx.executeSql(`create table if not exists user (id INTEGER PRIMARY KEY NOT NULL, userID TEXT NOT NULL,name TEXT NOT NULL, logoURL TEXT NOT NULL,mail TEXT NOT NULL, contact TEXT NOT NULL, label TEXT NOT NULL)`,
                [],
                ()=>{
                    resolve()
                },
                (_,err)=>{
                    reject(err)
                }
            )
        })
    })
    return promise
}
export const deleteUser = ()=>{
    const promise = new Promise((resolve,reject)=>{
        db.transaction(tx=>{
            tx.executeSql(`drop table user`,
            [],
            ()=>{
                resolve()
            },
            (_,err)=>{
                reject(err)
            })
        })
    })
    return promise
}
export const findUserID = ()=>{
    const promise = new Promise((resolve,reject)=>{
        db.transaction(tx=>{
            tx.executeSql(`select * from user where id == 1`,
            [],
            (_,result)=>{resolve(result)},
            (_,err)=>{reject(err)}
            )
        })
    })
    return promise
}
export const setUser = (id,name,logoURL,mail,contact,label)=>{
    const promise = new Promise((resolve,reject)=>{
        db.transaction(tx=>{
            tx.executeSql(`insert into user (userID,name,logoURL,mail,contact,label) values (?,?,?,?,?,?)`,
            [id,name,logoURL,mail,contact,label],
            ()=>{resolve()},
            (_,err)=>{reject(err)}
            )
        })
    })
    return promise
}