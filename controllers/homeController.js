const router = require('express').Router();

router.get('/', async (req, res) => {
    const cats = await req.storage.getAllCats();

    res.render('home/home', { cats });
});

module.exports = router;