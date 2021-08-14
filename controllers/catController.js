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

module.exports = router;