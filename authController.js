const router = require('express').Router();
const {body, validationResult} = require('express-validator');
const {isGuest,isUser} = require('../middlewares/guards')

router.get('/register',isGuest(), (req, res) => {
    res.render('register');
});

router.post('/register',isGuest(),
    body('username').isLength({min: 3}).withMessage('Username must be atleast 3 chars').bail()
    .isAlphanumeric().withMessage('Username must include alphanumeric chars only!'),
    body('password').isLength({min: 3}).withMessage('Password must be atleast 3 chars').bail()
    .isAlphanumeric().withMessage('Password must include alphanumeric chars only!'),
    body('rePass').custom((value, {req}) => {
        if (value != req.body.password) {
            throw new Error('passwords dont match');
        }
        return true;
    }),
   async (req, res) => {
        
        const {errors}=validationResult(req);
        
        try{
        if (errors.length>0){
          
            throw new Error(Object.values(errors).map(e=>e.msg).join('\n'));
        }
     await req.auth.register(req.body.username,req.body.password);
     console.log('user registered')
        res.redirect('/');
    } catch (err) {
        console.log(err)
        const ctx={
            errors: err.message.split('\n'),
            userData: {
                username:req.body.username
            }
        };
        res.render('register',ctx)
    }

    })

router.get('/login',isGuest(), (req, res) => {
    res.render('login');
});

router.post('/login',isGuest(), async (req, res) => {
   try{
       console.log(req.body.username, req.body.password);
       await req.auth.login(req.body.username, req.body.password);
       res.redirect('/');

   } catch(err){
    console.log(err.message);
    let errors=[err.message];
    if (err.type=='credential'){
        errors=['Incorrect username or password'];
    }
    const ctx={
        errors,
        userData: {
            username:req.body.username
        }
    };
    res.render('login',ctx)
   }
});

router.get('/logout', (req, res)=>{
    console.log('logging out')
    req.auth.logout();
    res.redirect('/')
})

module.exports = router;