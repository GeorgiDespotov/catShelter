const Cat = require('../modews/Cat');


async function getOneCat(id) {
    const cat = await Cat.findById(id).lean();
    return cat;
}

async function getAllCats() {
    return Cat.find().lean();
}

async function addCat(catData) {
    const pattern = new RegExp(`^${catData.name}$`, 'i');
    const existing = await Cat.findOne({ name: { $regex: pattern } });

    if (existing) {
        throw new Error('Name is taken!')
    }

    const cat = new Cat(catData);
    await cat.save();

    return cat;
}

module.exports = {
    getAllCats,
    addCat,
    getOneCat
}