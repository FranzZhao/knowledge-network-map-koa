// import data Schema
const Diary = require('../models/diarySchema');

class DiaryCtl {
    // 新建日志
    async create(ctx){
        // 1. request body的参数验证
        ctx.verifyParams({
            title: { type: 'string', required: true },
            tags: { type: 'array', itemType: 'string', required: false },
            text: { type: 'string', required: false },
        });
        // 2. 保存到diary表中
        const newDiary = await new Diary({
            author: ctx.state.user._id,
            ...ctx.request.body,
        }).save();
        // 3. 输出结果
        ctx.body = newDiary;
    }

    // 更新日志
    async update(ctx){
        // 1. request body的参数验证
        ctx.verifyParams({
            title: { type: 'string', required: false },
            tags: { type: 'array', itemType: 'string', required: false },
            text: { type: 'string', required: false },
        });
        // 2. 根据日志id更新数据
        const newDiary = await Diary.findByIdAndUpdate(
            ctx.params.id, ctx.request.body, {new: true}
        );
        // 3. 输出更新后的结果
        ctx.body = newDiary;
    }

    // 获取用户所有日志列表
    async find(ctx){
        // 1. 根据用户jwt中的id获取所有日志
        const userDiaries = await Diary.find({
            author: ctx.state.user._id,
        });
        // 2. 返回查找结果
        ctx.body = userDiaries;
    }

    // 获取用户特定日志的详细内容
    async findById(ctx){
        // 1. 根据日志id查找详细信息
        const diaryDetail = await Diary.findById(ctx.params.id);
        // 2. 返回查找结果
        ctx.body = diaryDetail;
    }
}

module.exports = new DiaryCtl();