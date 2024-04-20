const mongoose = require('mongoose')
const bycrypt = require('bcryptjs')
const JWT = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please Provide a Name'],
        minlength:3,
        maxlength:50
    },
    email:{
        type:String,
        required:[true,'Please Provide an Email'],
        match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,"Please Provide a Valid Email"],
        unique: true,
    },
    password:{
        type:String,
        required:[true,'Please Provide a password'],
        minlength:6    
    }
})

userSchema.pre('save', async function(){
    const salt = await bycrypt.genSalt(10)
    this.password = await bycrypt.hash(this.password,salt)
})

userSchema.methods.createJWT = function (){
    return JWT.sign({userId: this._id, name: this.name},process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME})
}

userSchema.methods.comparePassword = async function (canidatePassword)
{
    const isPassword = await bycrypt.compare(canidatePassword, this.password)
    return isPassword
}

module.exports = mongoose.model('User',userSchema)