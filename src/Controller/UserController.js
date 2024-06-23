const User = require('./../Models/UserModel')
const jwt = require('jsonwebtoken')

exports.userRegister = async (req, res) =>{
    const {userName, password} = req.body;
    console.log("USER ANME :", userName, password)
    try{
        const user = new User({userName, password})
        await user.save();
        res.json({
            status : 200,
            massage : 'User registered'
        })
    } catch(eror){
        res.json({
            status : 400,
            massage : "User already register"
        })
    }
}


// USER LOGIN =-------------------------
exports.userLogin = async(req, res) =>{
    const {userName, password} = req.body;

    const user = await User.findOne({userName})

    if(!user){
        return res.json({status : 400, massage : "User is not found"})
    }

    if(password != user.password){
        return res.json({status : 400, massage : "Password is incrorrect"})
    }

    const token = jwt.sign({userName}, "chat-bot")
    res.json({status : 200, token : token})
}

exports.getAllUser = async(req, res) =>{
    const users = await User.find()
    res.json({status : 200, data : users})
}

exports.getSingleUser = async(req, res) =>{
    const {username} = req;
    const user = await User.findOne({userName : username})
    res.json({status : 200, data : user})

}