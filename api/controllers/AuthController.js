import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
//models
const User = mongoose.model('User');

class AuthController {
    static sanitize_body(req, res, next) {
        const { password } = req.body;
        req.sanitizeBody('name');
        req.checkBody('name', 'Name field is required').notEmpty();
        req.checkBody('gender', 'Gender field is required').notEmpty();
        req.checkBody('email', 'Email field is required').notEmpty();
        req.checkBody('email', 'Enter a valid email').isEmail().normalizeEmail({
            remove_dots: true,
            remove_gmail_subaddress: true
        });
        req.checkBody('password', 'Password field is required').notEmpty();
        req.checkBody('password2', 'Confirm Password field is required').notEmpty();
        req.checkBody('password', 'Password should be more than 6 characters').isLength({ min: 6 });
        req.checkBody('password2', 'Make sure passwords match').equals(password);
        let errors = req.validationErrors();
        if (errors) {
            //bad request
            return res.status(400).json({
                ok: false,
                errors
            });
        }
        next();
    }

    static async register(req, res) {
        const { name, email, gender, password } = req.body;
        let user = await User.findOne({ email });
        if (user) {
            //bad request
            return res.status(400).json({
                ok: false,
                errors: "User exists"
            });
        }

        user = new User({
            name,
            email,
            gender,
            password
        });

        //generate a bcrypt has for password
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) throw err;
                user.password = hash;
                user.save();
                //send to user
                res.status(200).json({
                    ok: true,
                    data: user
                });

            })
        })
    }

    static sanitize_login_body(req, res, next) {
        req.checkBody('email', 'Email field is empty').notEmpty();
        req.checkBody('email', 'Enter a valid email').isEmail().normalizeEmail({
            remove_dots: true,
            remove_gmail_subaddress: true
        });
        req.checkBody('password', 'Password field is empty').notEmpty();
        let errors = req.validationErrors();
        if (errors) {
            //bad request
            res.status(400).json({
                ok: false,
                errors
            });
        }
        next();
    }

    static async login(req, res, next) {
        const { email, password } = req.body;
        let user = await User.findOne({ email });
        if (!user) {
            //unauthorized
            return res.status(401).json({
                ok: false,
                errors: 'Credentials wrong'
            });
        }

        //compare password
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (isMatch) {
                return res.status(200).json({
                    ok: true,
                    data: user
                });
            } else {
                return res.status(401).json({
                    ok: false,
                    errors: 'Credentials wrong'
                });
            }
        })
    }
}

export default AuthController;