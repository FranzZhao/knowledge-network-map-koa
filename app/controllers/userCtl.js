// import data Schema
const Users = require('../models/usersSchema');
const Maps = require('../models/mapsSchema');
const Nodes = require('../models/nodesSchema');
const Notebooks = require('../models/notebooksSchema');
// jwt token
const jwt = require('jsonwebtoken');
// path
const path = require('path');

class UserCtl {
    // user login
    async login(ctx) {
        // params verify
        ctx.verifyParams({
            e_mail: { type: 'string', require: true },
            password: { type: 'string', require: true },
            remember_me: { type: 'boolean', require: true },
        });
        const { e_mail, password, remember_me } = ctx.request.body;
        const expiresIn = remember_me ? '7d' : '1d';    //过期时间设定: 配合前端的"记住我"
        // find user in MongoDB
        const user = await Users.findOne({
            e_mail: e_mail,
            password: password,
        }).select('+password');
        // error verify
        if (!user) {
            ctx.throw(401, '邮箱或密码错误');
        }
        // success: set jwt token
        const { _id, username } = user;
        const token = jwt.sign(
            // data
            { _id, username },
            // secret key
            process.env.TOKEN_SECRET,
            // expiration: 1 day
            // 2d, 10h, 120=120ms
            { expiresIn: expiresIn }
        );
        ctx.body = { user, token };
    }

    // user register
    async register(ctx) {
        // params verify
        ctx.verifyParams({
            username: { type: 'string', require: true },
            e_mail: { type: 'string', require: true },
            password: { type: 'string', require: true }
        });
        // verify the username & e_mail whether only
        const { username, e_mail } = ctx.request.body;
        const repeatedUser = await Users.findOne({
            username: username,
            e_mail: e_mail,
        });
        if (repeatedUser) {
            ctx.throw(409, '用户已存在');
        }
        // push data into MongoDB
        const user = await new Users(ctx.request.body).save();
        ctx.body = ctx.request.body;
    }

    async jwtVerify(ctx) {
        ctx.body = "用户token在期限中";
    }

    // upload user avatar
    async uploadAvatar(ctx) {
        // 获取文件
        const file = ctx.request.files.file;
        // 获取文件名称+拓展名
        const baseName = path.basename(file.path);
        // 返回文件路径
        // ctx.origin => 域名
        const avatarUrl = `${ctx.origin}/uploads/${baseName}`;
        // 写入数据库中
        const user = await Users.findByIdAndUpdate(
            ctx.state.user._id,
            {
                avatar_url: avatarUrl
            },
            { new: true }
        );
        // 返回结果
        ctx.body = {
            status: true,
            message: 'success',
            payload: { url: avatarUrl },
        };
    }

    // 获取用户头像
    async getAvatar(ctx){
        const userAvatar = await Users.findById(ctx.state.user._id).select('+avatar_url');
        ctx.body = userAvatar.avatar_url;
    }

    // 用户知识笔记创建情况信息统计
    async staticUserKNM(ctx){
        // 1. knm数量
        const knm = await Maps.find();
        const knmNumbers = Object.keys(knm).length;
        // 2. nodes数量
        const nodes = await Nodes.find();
        const nodeNumbers = Object.keys(nodes).length;
        // 3. notebooks数量
        const notebooks = await Notebooks.find();
        const notebookNumbers = Object.keys(notebooks).length;
        // 4. return
        ctx.body = {
            knmNumbers: knmNumbers,
            nodeNumbers: nodeNumbers,
            notebookNumbers: notebookNumbers,
        };
    }
}

module.exports = new UserCtl();