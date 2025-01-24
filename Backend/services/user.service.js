const userModel = require('../models/user.model');

module.exports.createUser = async ({ firstname, lastname, username, email, password, mobile, profileImage }) => {
    if (!firstname || !username || !email || !password || !mobile) {
        throw new Error('All fields are required');
    }

    const user = await userModel.create({
        fullname: {
            firstname,
            lastname,
        },
        username,
        email,
        password,
        mobile,
        profileImage,
    });
    return user;
};
