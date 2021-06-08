var db = require("../config/connection")
var collection = require("../config/collections")
const bcrypt = require('bcrypt')
module.exports = {
    addUser: async (user, callback) => {
        user.password = await bcrypt.hash(user.password, 10)
        db.get().collection(collection.USER_COLLECTION).insertOne(user).then((data) => {
            callback(data.ops[0]);
        })

    },
    getAllUser: () => {
        return new Promise(async (resolve, reject) => {
            let users = await db.get().collection(collection.USER_COLLECTION).find().toArray()
            resolve(users)
        })
    },
    userLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ username: userData.username })
            if (user) {
                bcrypt.compare(userData.password, user.password).then((status) => {
                    if (status) {
                        response.status = true
                        response.user = user
                        loginStatus  =true
                        resolve(response,loginStatus)

                    } else {
                        console.log('password faield -- faield');
                        resolve({ status: false },loginStatus)
                    }
                })
            } else {
                console.log('user dont exist -- faield');
                resolve({ status: false },loginStatus)

            }



        })
    }

}