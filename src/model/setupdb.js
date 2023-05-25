const connection = require('./connection');
const collectionData = require('./db');

let setupdb = async () => {
    let userModel = await connection.getUserCollection();
    let deletedUsers = await userModel.deleteMany({})
    let insertedUsers = await userModel.insertMany(collectionData.usersDb);
    let productsModel = await connection.getProductsCollection();
    let deletedProducts = await productsModel.deleteMany({});
    let insertedPrdoucts = await productsModel.insertMany(collectionData.productsDB);
    if (insertedUsers.length && insertedPrdoucts.length) return { "message": "Data initialised successfully" }
    else throw new Error("Data Initialization failed")
}

module.exports = setupdb;

