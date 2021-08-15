const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const { isUser } = require('../middlewears/guards');

router.get('/addCat', isUser(), (req, res) => {
    res.render('cats/addCat');
});

router.post('/addCat',
    isUser(),
    body('name')
        .notEmpty().withMessage('Catname is required').bail()
        .isLength({ min: 3 }).withMessage('Catname must be atleast 3 symbols!').bail(),
    body('bread')
        .notEmpty().withMessage('Bread is required!').bail(),
    body('description')
        .notEmpty().withMessage('Description is required!').bail()
        .isLength({ min: 10 }).withMessage('Description must be atleast 10 charectars!').bail(),
    body('age')
        .notEmpty().withMessage('Age is required!').bail(),
    body('imageUrl')
        .notEmpty().withMessage('Image URL is required!').bail()
        .matches('^https?').withMessage('Image Url must be valid!').bail(),
    async (req, res) => {
        const { errors } = validationResult(req);
        try {
            req.body.author = req.user._id;
            if (errors.length > 0) {
                throw new Error(errors.map(err => err.msg).join('\n'));
            }
            await req.storage.addCat(req.body);
            res.redirect('/');
        } catch (err) {
            console.log(err.message);
            const ctx = {
                errors: err.message.split('\n'),
                catData: {
                    name: req.body.name,
                    bread: req.body.bread,
                    description: req.body.description,
                    age: Number(req.body.age),
                    imageUrl: req.body.imageUrl
                }
            }
            res.render('cats/addCat', ctx)
        }
    });

router.get('/details/:id', async (req, res) => {
    try {
        const cat = await req.storage.getOneCat(req.params.id);
        cat.isAuthor = req.user._id == cat.author;
        cat.hasUser = Boolean(req.user);
        res.render(`cats/details`, { cat });

    } catch (err) {
        console.log(err.message);
        res.redirect('/404');
    }
});

router.get('/deleteCat/:id', isUser(), async (req, res) => {
    try {
        const cat = await req.storage.getOneCat(req.params.id);

        if (req.user._id != cat.author) {
            throw new Error('Only the author can delete this article!');
        }
        await req.storage.deleteCat(req.params.id);
        res.redirect('/');
    } catch (err) {
        console.log(err.message);
        res.redirect(`/cats/details/${req.params.id}`);
    }
});

router.get('/editCat/:id', isUser(), async (req, res) => {
    try {
        const cat = await req.storage.getOneCat(req.params.id);
        if (req.user._id != cat.author) {
            throw new Error('Only the athor can edit this article!');
        }
        res.render('cats/editCat', { cat });
    } catch {
        console.log(err.message);
        res.redirect(`/cats/details/${req.params.id}`);
    }
});

router.post('/editCat/:id', isUser(),
    body('name')
        .notEmpty().withMessage('Catname is required').bail()
        .isLength({ min: 3 }).withMessage('Catname must be atleast 3 symbols!').bail(),
    body('bread')
        .notEmpty().withMessage('Bread is required!').bail(),
    body('description')
        .notEmpty().withMessage('Description is required!').bail()
        .isLength({ min: 10 }).withMessage('Description must be atleast 10 charectars!').bail(),
    body('age')
        .notEmpty().withMessage('Age is required!').bail(),
    body('imageUrl')
        .notEmpty().withMessage('Image URL is required!').bail()
        .matches('^https?').withMessage('Image Url must be valid!').bail(),
    async (req, res) => {
        const { errors } = validationResult(req);
        try {
            const cat = await req.storage.getOneCat(req.params.id);
            if (req.user._id != cat.author) {
                throw new Error('Only the athor can edit this article!');
            }
            if (errors.length > 0) {
                throw new Error(errors.map(err => err.msg).join('\n'));
            }
            await req.storage.editCat(req.params.id, req.body);
            res.redirect(`/cats/details/${req.params.id}`);
        } catch (err) {
            console.log(err.message);
            const ctx = {
                errors: err.message.split('\n'),
                cat: {
                    _id: req.params.id,
                    name: req.body.name,
                    bread: req.body.bread,
                    description: req.body.description,
                    age: Number(req.body.age),
                    imageUrl: req.body.imageUrl
                }
            }
            res.render('cats/editCat', ctx);
        }
    });

    router.get('/adoptCat/:id', isUser(), async (req, res) => {
        try {
            const cat = await req.storage.getOneCat(req.params.id);
            if (req.user._id == cat.author) {
                throw new Error('The aouthor can\'t adopt a cat he put for adoption!');
            }
            await req.storage.adoptCat(req.params.id, req.user._id);
            res.redirect('/');
        } catch (err) {
            console.log(err.message);
            res.render(`cats/details/${req.params.id}`);
        }
    });

module.exports = router;