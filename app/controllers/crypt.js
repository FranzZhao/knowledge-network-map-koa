const bcrypt = require('bcryptjs');

// 加密
const encrypt = (password) => {
    // 盐
    let salt = bcrypt.genSaltSync(5);
    // 加盐后的密码
    let hash = bcrypt.hashSync(password, salt);
    return hash;
};

// 解密
const decrypt = (password, hash) => {
    return bcrypt.compareSync(password, hash);
}

module.exports = {
    encrypt: encrypt,
    decrypt: decrypt,
};