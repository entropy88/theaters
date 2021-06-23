const playService=require('../services/play')

module.exports=()=>(req, res, next)=>{
 
    //... means destructuring
    req.storage={
       ...playService
    };
    next();
};