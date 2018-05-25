/**
 * 封装数据库
 */

const Mongodb = require('mongodb')
const MongoClient = Mongodb.MongoClient
const ObjectId = Mongodb.ObjectID

const Config = require('./config')

class Db {


  /**
   * 实例单例化，解决无共享问题
   */
  static getInstance() {
    if(!Db.instance) Db.instance = new Db()
    return Db.instance
  
  }

  constructor() {
    this.dbClient = '' //存放db对象
    this.__connect() //初始化连接数据库
  }

  __connect() {
    return new Promise((resolve, reject) => {
      if(!this.dbClient) { //解决数据库多次连接问题
        MongoClient.connect(Config.dbUrl, (err, client) => {
          if(err) {
            reject(err)
          } else {
            this.dbClient = client.db(Config.dbName)
            resolve(this.dbClient)
          }
        })
      } else {
        resolve(this.dbClient)
      }
    })
  }
  find(collectionName, json) {
    return new Promise((resolve, reject) => {
      this.__connect().then((db) => {
        let result = db.collection(collectionName).find(json)
        result.toArray((err, doc) => {
          if(err) {
            reject(err)
            return
          }
          resolve(doc)
        })
      })
    })
  }
  update(collectionName, json1, json2) {
    return new Promise((resolve, reject) => {
      this.__connect().then(db => {
        db.collection(collectionName).updateOne(json1, {
          $set: json2
        }, (err, doc) => {
          if(err) {
            reject(err)
          } else {
            resolve(doc)
          }
        })
      })
    })
  }
  insert(collectionName, json) {
    return new Promise((resolve, reject) => {
      this.__connect().then(db => {
        db.collection(collectionName).insertOne(json, (err, doc) => {
          if(err) {
            reject(err)
          } else {
            resolve(doc)
          }
        })
      })
    })
  }
  remove(collectionName, json) {
    return new Promise((resolve, reject) => {
      this.__connect().then(db => {
        db.collection(collectionName).removeOne(json, (err, doc) => {
          if(err) {
            reject(err)
          } else {
            resolve(doc)
          }
        })
      })
    })
  }
  getObjectId(id) {
    return new ObjectId(id)
  }
}

module.exports = Db.getInstance()