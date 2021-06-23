const Play=require('../models/Play');

async function getAllPlays(){
return await Play.find({public: true}).sort({createdAt: -1}).lean();

}

async function getPlayById(id){
    const play=await Play.findById(id).populate('usersLiked').lean();
    console.log('play returned by getplay by id service\n')
    console.log(play)
// return await Play.findById(id).populate('usersLiked').lean();
return play;
}

async function createPlay(playData){
    const pattern = new RegExp(`^${playData.title}$`,'i');
    const existing = await Play.findOne({title: {$regex:pattern}});
    console.log('the existing play is:',existing)
    if (existing){
        throw new Error('A play with this name already exists!')
    }
    const play=new Play(playData);
    console.log('play data from play service', playData)
    await play.save();
    console.log(play);
    return play;

}

async function editPlay(id, playData){

}

async function deletePlay(id){

}

module.exports={
    getAllPlays,
    getPlayById,
    createPlay,
    editPlay,
    deletePlay
}