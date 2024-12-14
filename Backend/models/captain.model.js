const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const captainSchema = new mongoose.Schema({
    fullname:{
        firstname:{
            type: String,
            require:true,
            minlength:[3,'first name at least 3 character']
        },
        lastname:{
            type: String,
            minlength:[3,'last name at least 3 charcter']
        }
    },
    email:{
        type: String,
        require:true,
        minlength:[5,'email at least 5 charcter'],
        lowercase:true,
        unique:true
    },
    password:{
        type: String,
        require:true,
        select:false
    },
    socketId:{
        type:String
    },
    stutus:{
        type:String,
        enum:['active','inactive'],
        default:'inactive',
    },
    vehicle:{
        color:{
            type:String,
            require:true,
            minlength:[2,'colour name is at least 2 character']
        },
        plate:{
            type:String,
            require:true,
            minlength:[3,'plate must at least 3 charcter']
        },
        capacity:{
            type: Number,
            require:true,

            min:[1,'capacity must at least 1 passanger']
        },
        vehicleType:{
            type:String,
            require:true,
            enum:['car','auto','motorcycle']
        }
    },
    location:{
        lat:{
            type:Number,
        },
        lng:{
            type:Number,
        }
    }

});

captainSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id: this._id}, process.env.JWT_SECRET,{ expiresIn: '24h' });
    return token;
}

captainSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password,this.password);
}

captainSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password,10);
}

const captainModel = mongoose.model('captain',captainSchema);

module.exports= captainModel;