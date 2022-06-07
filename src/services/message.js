const db = require('../models/index.js');
const { Op } = require("sequelize");

create_message = async(owner,content) => {
    const message = await db.Messages.create({
        owner:owner,
        content: content
    })
    return message
}
all_message = async () => {
    const message = await db.Messages.findAll({        
        include: { model: db.Users ,attributes: ['name']},
        order:["id"]
    })
    return message
}

select_message = async (query) => {
    if(query.value ==="content"){
        const message = await db.Messages.findAll({        
            include: { model: db.Users ,attributes: ['name']},
            where:{
                content:{
                    [Op.like]: '%'+query.select+'%'
                }                
            },
            order:["id"]
        })
        return message
    }else if(query.value ==="name"){
        const message = await db.Messages.findAll({        
            include: { model: db.Users ,attributes: ['name']},
            where:{
                owner:{
                    [Op.like]: '%'+query.select+'%'
                }                
            },
            order:["id"]
        })
        return message
    }else{
        const message = await db.Messages.findAll({        
            include: { model: db.Users ,attributes: ['name']},
            where:{
                [Op.or]: [{ content:{[Op.like]: '%'+query.select+'%'}},{owner:{[Op.like]: '%'+query.select+'%'}}]                                
            },
            order:["id"]
        })
        return message
    }
    
}

update_message = async(account,content,id) => {
    const message = await db.Messages.update(
        {
            content: content
        },
        {
            where: {
            id:id,
            owner:account
        }
        }
        )
        
        return message
}

delete_message = async (id,account) =>{
    const message = await db.Messages.destroy({
        where: {
            id:id,
            owner:account
        }
    })
    return message
}

module.exports = {
    create_message,
    all_message,
    update_message,
    delete_message,
    select_message
}