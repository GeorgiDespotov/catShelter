const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const { isGuest, isUser } = require('../middlewears/guards');
const userServices = require('../services/user');


router.get('/register', isGuest(), (req, res) => {
    res.render('user/register');
});

router.post('/register',
    isGuest(),
    body('username')
        .notEmpty().withMessage('Username is required!')
        .isLength({ min: 3 }).withMessage('Ussername must be at least 3 ch long').bail(),
    body('password')
        .notEmpty().withMessage('Password is required!')
        .isLength({ min: 3 }).bail(),
    body('rePass')
        .notEmpty().withMessage('You must repeat the password!')
        .custom((value, { req }) => {
            if (value != req.body.password) {
                throw new Error('password don\'t match!')
            }
            return true
        }),
    async (req, res) => {
        const { errors } = validationResult(req);
        try {
            if (errors.length > 0) {
                // TODO impruve err message
                throw new Error(Object.values(errors).map(e => e.msg).join('\n'));

            }

            await req.auth.register(req.body.username, req.body.password);
            res.redirect('/'); //TODO change redirect location 
        } catch (err) {
            console.log(err);
            const ctx = {
                errors: err.message.split('\n'),
                userData: {
                    username: req.body.username
                }
            }
            res.render('user/register', ctx)
        }
    });

router.get('/login', isGuest(), (req, res) => {
    res.render('user/login');
});

router.post('/login', isGuest(), async (req, res) => {
    try {
        await req.auth.login(req.body.username, req.body.password);
        res.redirect('/'); //TODO change redirect location 
        ``
    } catch (err) {
        console.log(err);
        if (err.type == 'credential') {
            errors = ['incorect username or password!']
        }
        const ctx = {
            errors,
            userData: {
                username: req.body.username
            }
        };
        res.render('user/login', ctx);
    }
});

router.get('/logout', (req, res) => {
    req.auth.logout();
    res.redirect('/');
});

router.get('/profile', isUser(), async (req, res) => {
    try {

        const user = await userServices.getUserById(req.user._id);

        user.catNames = user.adoptedCats.map(cat => cat.name).join(', ');
        res.render('user/profile', { user });
    } catch (err) {
        console.log(err.message);

        res.redirect('/auth/login');
    }
});

module.exports = router;
