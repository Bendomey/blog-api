import mongoose from 'mongoose';
const Blog = mongoose.model('Blog');
const User = mongoose.model('User');

class BlogContainer {
    static sanitize_create(req, res, next) {
        req.checkBody('title', 'Title field is empty').notEmpty();
        req.checkBody('description', 'Description field is empty').notEmpty();
        req.checkBody('body', 'Body field is empty').notEmpty();
        req.checkBody('userId', 'User ID field is empty').notEmpty();
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


    static async create(req, res) {
        const { title, description, body, userId } = req.body;
        let blog = await Blog.create({
            title,
            description,
            body,
            userId,
            updated_at: Date.now()
        });
        return res.status(200).json({
            ok: true,
            success: "Blog created successfully",
            data: blog
        });
    }

    static async readBlog(req, res) {
        let blog = await Blog.findOne({ _id: req.params.id });
        return res.status(200).json({
            ok: true,
            data: blog
        });
    }

    static async readAll(req, res) {
        let blog = await Blog.find();
        return res.status(200).json({
            ok: true,
            data: blog
        });
    }

    static async readUserBlogs(req, res) {
        let user = await User.findById(req.params.user_id).populate('blogs');
        return res.status(200).json({
            ok: true,
            data: user.blogs
        });
    }

    static sanitize_update(req, res, next) {
        req.checkBody('title', 'Title field is empty').notEmpty();
        req.checkBody('description', 'Description field is empty').notEmpty();
        req.checkBody('body', 'Body field is empty').notEmpty();
        req.checkBody('id', 'User ID field is empty').notEmpty();
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

    static async update(req, res) {
        const { id, title, description, body } = req.body;
        let blog = await Blog.findById(id);
        if (!blog) {
            return res.json({
                ok: false,
                error: "Blog not found"
            })
        }
        blog.title = title;
        blog.description = title;
        blog.body = body;
        blog.updated_at = Date.now();
        await blog.save();
        return res.status(200).json({
            ok: true,
            data: blog
        });
    }

    static sanitize_profile(req, res, next) {
        req.checkBody('id', 'User Id field is empty').notEmpty();
        req.checkBody('name', 'Name field is empty').notEmpty();
        req.checkBody('email', 'Email field is empty').notEmpty();
        req.checkBody('email', 'Email is invalid').isEmail().normalizeEmail({
            remove_dots: true,
            remove_gmail_subaddress: true
        });
        req.checkBody('gender', 'Gender field is empty').notEmpty();
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

    static async updateProfile(req, res) {
        const { id, name, email, gender } = req.body;
        let user = await User.findById(id);
        if (!user) {
            return res.status(401).json({
                ok: false,
                error: "User not found"
            });
        }
        user.name = name;
        user.email = email;
        user.gender = gender;
        user.updated_at = Date.now();
        await user.save();
        return res.status(200).json({
            ok: true,
            data: user
        });
    }

    static async destroyBlog(req, res) {
        let blog = await Blog.findById(req.body.id);
        if (!blog) {
            return res.status(401).json({
                ok: false,
                error: 'Blog not found'
            });
        }
        await blog.delete();
        return res.status(200).json({
            ok: true,
            data: "Blog deleted successfully"
        });
    }

}

export default BlogContainer;