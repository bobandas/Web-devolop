var db = require("../config/connection")
var collection = require("../config/collections");

const ObjectId = require("mongodb").ObjectId


module.exports = {

    addProduct: (product, callback) => {

        db.get().collection(collection.PRODUCT_COLLECTION).insertOne(product).then((data) => {

            callback(data.ops[0]._id);
        })
    },
    getAllPoducts: () => {
        return new Promise(async (resolve, reject) => {
            let products = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)
        })
    },
    createCart: (userId) => {
        let userCart = {
            user: ObjectId(userId) ,
            products:[]


        }
        return new Promise(async (resolve, reject) => {
            let createCart = await db.get().collection(collection.CART_COLECTION).insertOne(userCart)

            resolve(createCart)
        })

    },
    addToCart: (items, userId) => {


        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.CART_COLECTION)
                .updateOne({ user: ObjectId(userId) }, { $push: { products: ObjectId(items)   } })

            resolve()
        })
    },
    getCart: (userId) => {
        
        return new Promise(async (resolve, reject) => {
            
            let userCart = await db.get().collection(collection.CART_COLECTION).aggregate([
                {
                    $match: { user: ObjectId(userId) }
                },
                {
                    $lookup: {
                        from: collection.PRODUCT_COLLECTION,
                        let: { proList: '$products' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $in: ['$_id', "$$proList"]
                                    }
                                }
                            }
                        ],
                        as: "cartItems"

                    }
                }
            ]).toArray()
            
            resolve(userCart[0].cartItems)
          
        })
    }
}


