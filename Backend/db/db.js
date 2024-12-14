const mongoose = require('mongoose');

function connectToDb(){
    mongoose.connect(process.env.DB_CONNECT).then(()=>{
        console.log('conected to DB');
    }).catch(err => console.log('err',err));
}

module.exports = connectToDb;