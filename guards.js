function isUser(){
    return (req,res,next)=>{
    if (req.user){
        next();
    } else {
        res.redirect('/auth/login')
    }
};
}

function isGuest(){
    return (req,res,next)=> {
    if (!req.user){
        next();
    } else {
        res.redirect('/');
    }
};
}

//THIS REDIRECTS ALL TOLOGIN

module.exports={
    isUser, 
    isGuest
}