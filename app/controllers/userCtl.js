// import data Schema
const Users = require('../models/usersSchema');
// jwt token
const jwt = require('jsonwebtoken');

class UserCtl {
    // user login
    async login(ctx) {
        // params verify
        ctx.verifyParams({
            e_mail: { type: 'string', require: true },
            password: { type: 'string', require: true },
        });
        const { e_mail, password } = ctx.request.body;
        // find user in MongoDB
        const user = await Users.findOne({
            e_mail: e_mail,
            password: password,
        }).select('+password');
        // error verify
        if (!user){
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
            { expiresIn: '10000' }
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

    async jwtVerify(ctx){
        ctx.body = "用户token在期限中";
    }
}

module.exports = new UserCtl();