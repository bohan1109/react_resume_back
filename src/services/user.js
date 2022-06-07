const db = require('../models/index.js');
const bcrypt = require('bcrypt');
const { Op } = require("sequelize");
const jwt = require('jsonwebtoken');

update_user = async (account,email,name) =>{
    const user = await db.Users.update({
        email: email,
        name: name
    },{where:{
        account:account
    }})
    
    return user

}

find_user = async (account) => {
    const user = await db.Users.findOne({
        where:{
            account:account
        }
    })
    return user
}

register = async (name,account,password,email) => {
    const user = await db.Users.create({
        name:name,
        account:account,
        password:bcrypt.hashSync(password, 10),
        email:email,
    })
    return user;
}

is_admin = async (body) =>{
    const user = await db.Users.findOne({
        raw:true,
        where: {
            [Op.or]: [{ account: body.account},{email: body.account}]
        }
    })
    return user;
}

create_token = async (admin_data) => {

    const token = jwt.sign(
        {account: admin_data.account},
        process.env.JWT_SECRET,
        {expiresIn: '1h'}
    )
    await db.Users.update({
        token: token,        
    },{
        where: {
        account: admin_data.account
            }
        }
    )
    return token;
}



module.exports = {
    register,
    is_admin,
    create_token,
    find_user,
    update_user
}