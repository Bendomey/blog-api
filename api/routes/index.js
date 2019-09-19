import { Router } from 'express';
const Route = Router();

//import controllers
import AuthController from '../controllers/AuthController';
import BlogController from '../controllers/BlogController';

Route.route('/register')
    .post(AuthController.sanitize_body, AuthController.register);

Route.route('/login')
    .post(AuthController.sanitize_login_body, AuthController.login);

//create a blog
Route.post('/blog/create', BlogController.sanitize_create, BlogController.create);
//read a specific blog
Route.get('/blog/read/:id', BlogController.readBlog);
//read all blogs
Route.get('/blog/read', BlogController.readAll);
//read blogs pertaining to a user
Route.get('/user/blogs/:user_id', BlogController.readUserBlogs);
//update blog
Route.post('/blog/update', BlogController.sanitize_update, BlogController.update);
//update user
Route.post('/user/update', BlogController.sanitize_profile, BlogController.updateProfile);
//delete blog
Route.post('/blog/delete', BlogController.destroyBlog);


module.exports = Route;