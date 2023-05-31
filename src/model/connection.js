const mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    userName: { type: String, required: [true, 'userName is mandatory'], unique: true },
    password: { type: String, required: [true, 'password is mandatory'] },
    orders: {
        type: [
            {
                orderId: { type: Number, unique: true },
                productName: { type: String, required: [true, 'Product Name is mandatory'] },
                billAmount: { type: String, required: [true, 'Bill Amount is mandatory'] }
            }
        ], default: []
    }
})

let connection = {}

connection.getUserCollection = async () => {
    try {
        let conn = await mongoose.connect('mongodb://localhost:27017/UsersDB', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
        let userModel = await conn.model('Users', userSchema);
        return userModel;
    } catch (error) {
        if (error) { throw error; }
        else {
            let err = new Error('Database Connection failed');
            err.status = 500;
            throw err;
        }
    }
}

module.exports = connection;
