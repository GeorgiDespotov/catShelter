const Cat = require('../modews/Cat');
const User = require('../modews/User');


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

async function deleteCat(id) {
    return Cat.findByIdAndDelete(id);
}

async function editCat(id, catData) {
    const cat = await Cat.findById(id);

    cat.name = catData.name;
    cat.bread = catData.bread;
    cat.description = catData.description;
    cat.age = Number(catData.age);
    cat.imageUrl = catData.imageUrl;

    await cat.save();
    return cat;
}

async function adoptCat(catId, userId) {
    const user = await User.findById(userId);
    const cat = await Cat.findById(catId);

    cat.isAdopted = true;
    user.adoptedCats.push(catId);

    await user.save();
    await cat.save();

    return user;
} 

module.exports = {
    getAllCats,
    addCat,
    getOneCat,
    deleteCat,
    editCat,
    adoptCat
}