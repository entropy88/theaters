const router=require('express').Router();
const {isUser}=require('../middlewares/guards');
const { parseError } = require('../util/parsers');

router.get('/create',isUser(), (req, res)=>{
    console.log(req.user)
    res.render('create')
})

router.post('/create',isUser(),async (req, res)=>{

    console.log(req.body);
try{
    const playData={
        title:req.body.title,
        description:req.body.description,
        imageUrl:req.body.imageUrl,
        public:Boolean(req.body.public),       
        author: req.user._id
    };
    console.log(playData)
    
    await req.storage.createPlay(playData);
  
    res.redirect('/');
}catch (err){
    console.log(err.message)
    
    const ctx={
        errors:parseError(err),
        playData:{
            title:req.body.title,
            description:req.body.description,
            imageUrl:req.body.imageUrl,
            public:Boolean(req.body.public),       
        }
    }
    res.render('create',ctx);
}

  
});

router.get('/details/:id', async(req, res)=>{
    try{
        const play= await req.storage.getPlayById(req.params.id);
        console.log(play);
        // console.log(req.user)
        play.hasUser=Boolean(req.user);
        play.isAuthor=req.user && req.user._id==play.author;
        play.liked=req.user&&play.usersLiked.includes(req.user._id);
        console.log(play.usersLiked)
        // console.log(play)

        res.render('details',{play});
    } catch (err){
        res.redirect('/');
    }
  
})

module.exports=router;