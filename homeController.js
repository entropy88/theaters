const router = require('express').Router();



router.get('/',  async (req, res)=>{
    console.log(req.query)
   const plays=await req.storage.getAllPlays(req.query.orderBy);
 
    res.render('home', {plays})
});

module.exports=router;