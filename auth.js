const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const {TOKEN_SECRET, COOKIE_NAME}= require('../config')

const userService=require('../services/userService');

module.exports=()=> function(req, res, next){
    if (parseToken(req,res)){
    
        req.auth={
            async register(username,password){
                const token= await register(username, password);
                res.cookie(COOKIE_NAME, token)
            },
            async login(username, password){
                const token=await login(username, password);
                res.cookie(COOKIE_NAME,token);
            },
            logout(){
                res.clearCookie(COOKIE_NAME);
            }
        };


        next();
    }
    };


async function register(username, password){
    //adapt params and validate
    const existing=await userService.getUserByUsername(username);
    if (existing){
        throw new Error ('Username is taken!');
    }

    const hashedPassword=await bcrypt.hash(password, 10);
    const user=await userService.createUser(username, hashedPassword);

    //logi user
    return generateToken(user);
}

async function login(username, password){
    const user=await userService.getUserByUsername(username);
  
    if (!user){
        const err=new Error ('No such user');
        err.type='credential';
        throw err;
    }

    const hasMatch=await bcrypt.compare(password, user.hashedPassword);
    console.log(password, user.hashedPassword)
    if (!hasMatch){
        const err=new Error ('Wrong password');
        err.type='credential';
        throw err;
    }

    return generateToken(user);

}

function generateToken(userData){
    return jwt.sign({
        _id:userData._id,
        username:userData.username
    }, TOKEN_SECRET);
   
}

function parseToken(req,res){
    const token=req.cookies[COOKIE_NAME];
    if (token){
    try {
        const userData=jwt.verify(token, TOKEN_SECRET);
        req.user=userData;
        //SAVE user data here
        res.locals.user=userData;
    } catch (err) {
        res.clearCookie(COOKIE_NAME);
        res.redirect('/auth/login');

        return false;
    }
}
return true;
}