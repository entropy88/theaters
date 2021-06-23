const Play=require('../models/Play');

async function getAllPlays(orderBy){
    let sort = { createdAt: -1};
    if (orderBy=='likes'){
        sort = { usersLiked: 'desc'}
    }



return await Play.find({public: true}).sort(sort).lean();
}

async function getPlayById(id){
    const play=await Play.findById(id).populate('usersLiked').lean();

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
const play=await Play.findById(id);
play.title=playData.title;
play.description=playData.description;
play.imageUrl=playData.imageUrl;
play.public=Boolean(playData.public);

return await play.save();
}

async function likePlay(playId, userId){
    const play=await Play.findById(playId);

    play.usersLiked.push(userId);
    console.log('play liked!')
     return await play.save();
}

async function deletePlay(id){
return await Play.findByIdAndDelete(id);
}

module.exports={
    getAllPlays,
    getPlayById,
    createPlay,
    editPlay,
    deletePlay,
    likePlay
}