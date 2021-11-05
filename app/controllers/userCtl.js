// import data Schema
const Users = require('../models/usersSchema');
const Maps = require('../models/mapsSchema');
const Graphs = require('../models/graphsSchema');
const Nodes = require('../models/nodesSchema');
const Notebooks = require('../models/notebooksSchema');
// jwt token
const jwt = require('jsonwebtoken');
// path
const path = require('path');
// crypt
const Crypt = require('./crypt');


class UserCtl {
    // user login
    async login(ctx) {
        // params verify
        ctx.verifyParams({
            e_mail: { type: 'string', required: true },
            password: { type: 'string', required: true },
            remember_me: { type: 'boolean', required: true },
        });
        const { e_mail, password, remember_me } = ctx.request.body;
        const expiresIn = remember_me ? '7d' : '1d';    //过期时间设定: 配合前端的"记住我"
        // find user in MongoDB
        const user = await Users.findOne({
            e_mail: e_mail,
            // password: password,
        }).select('+password');

        // error verify
        if (!user) {
            ctx.throw(401, '邮箱错误');
        } else {
            // 密码校验
            const checkPassword = Crypt.decrypt(password, user.password);
            if (checkPassword) {
                ctx.throw(401, '密码错误');
            }
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
            username: { type: 'string', required: true },
            e_mail: { type: 'string', required: true },
            password: { type: 'string', required: true }
        });
        // verify the username & e_mail whether only
        // const { username, e_mail } = ctx.request.body;
        // const repeatedUser = await Users.findOne({
        //     username: username,
        //     e_mail: e_mail,
        // });
        // if (repeatedUser) {
        //     ctx.throw(409, '用户已存在');
        // }
        // 可以注册: 为用户密码加密
        ctx.request.body.password = Crypt.encrypt(ctx.request.body.password);
        // push data into MongoDB
        const user = await new Users(ctx.request.body).save();
        ctx.body = user;
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
    async getAvatar(ctx) {
        const userAvatar = await Users.findById(ctx.state.user._id).select('+avatar_url');
        ctx.body = userAvatar.avatar_url;
    }

    // 用户知识笔记创建情况信息统计
    async staticUserKNM(ctx) {
        // 1. knm数量
        const knm = await Maps.find({
            author: ctx.state.user._id
        });
        const knmNumbers = Object.keys(knm).length;
        // 2. nodes数量
        const nodes = await Nodes.find({
            author: ctx.state.user._id
        });
        const nodeNumbers = Object.keys(nodes).length;
        // 3. notebooks数量
        const notebooks = await Notebooks.find({
            author: ctx.state.user._id
        });
        const notebookNumbers = Object.keys(notebooks).length;

        // 4. 统计每个knm下有多少nodes&links&notebooks
        let knmStatic = [];

        for (let i in knm) {
            // 4.1 获取每个knm-graph下的所有知识节点与知识关联
            const graph = await Graphs.findOne({
                knmId: knm[i]['_id']
            });
            const allNodes = graph.nodes;
            const allLinks = graph.links;
            // 4.2 获取每个知识节点与知识关联下的知识笔记
            const nodeNotebooks = await Notebooks.find({
                relationNode: allNodes
            });
            const linkNotebooks = await Notebooks.find({
                relationLink: allLinks
            });
            // 4.3 统计知识笔记的数量
            const currentKnmStatic = {
                id: knm[i]['_id'],
                knmName: knm[i]['title'],
                nodesNum: allNodes.length,
                linkNum: allLinks.length,
                noteNum: nodeNotebooks.length + linkNotebooks.length
            };
            knmStatic.push(currentKnmStatic);
        }

        ctx.body = {
            knmNumbers: knmNumbers,
            nodeNumbers: nodeNumbers,
            notebookNumbers: notebookNumbers,
            detail: knmStatic,
        }
    }

    // 用户信息修改前的密码确认
    async checkPassword(ctx) {
        // params verify
        ctx.verifyParams({
            e_mail: { type: 'string', require: true },
            password: { type: 'string', require: true },
        });
        const { e_mail, password } = ctx.request.body;
        // find user in MongoDB
        const user = await Users.findOne({
            e_mail: e_mail,
            // password: password,
        }).select('+password');

        // 密码校验
        const checkPassword = Crypt.decrypt(password, user.password);
        if (!checkPassword) {
            // error
            ctx.throw(401, '密码错误');
        }
        // success
        ctx.body = '校验成功';
    }

    // 更新用户信息
    async update(ctx){
        // 1. params verify
        ctx.verifyParams({
            username: { type: 'string', required: false },
            e_mail: { type: 'string', required: false },
            password: { type: 'string', required: false }
        });
        // 2. if it has password, then encrypt
        if (ctx.request.body.password){
            ctx.request.body.password = Crypt.encrypt(ctx.request.body.password);
        }
        // 3. update to MongoDB
        const newUserInfo = await Users.findByIdAndUpdate(
            ctx.state.user._id, ctx.request.body, {new: true}
        );
        ctx.body = newUserInfo;
    }
}

module.exports = new UserCtl();