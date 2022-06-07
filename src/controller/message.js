const message_service = require("../services/message.js");

const jwt = require('jsonwebtoken');
const xss = require("xss")

//c
create_message = async (req, res) => {
    try {
        let token = req.headers.token || req.headers['x-access-token'];
        if(token){
            jwt.verify(token, process.env.JWT_SECRET, async(err, decoded)=> {
                if(err) {
                    return  res.status(402).json({ message: err });
                }else{
                    const message = await message_service.create_message(xss(decoded["account"]),xss(req.body.content))
                    if(message){
                        return res.status(200).json({ message: "新增成功" });
                    }else{
                        return res.status(400).json({ message: "新增失敗" });
                    }
                }
            })
        }
    }catch (err) {
        return res.status(500).json({ message: err.message });
    }
    
}
//R
read_message = async (req, res) => {
    try {
        if(req.query.select||req.query.value){
            const message = await message_service.select_message(req.query)
            message.forEach((item) => {
                const name = item.User.name
                item['dataValues']['name'] = name
                delete item['dataValues']['User']                
            })
            return res.status(200).json({ message: message})
        }else{
            const message = await message_service.all_message()
            message.forEach((item) => {
            const name = item.User.name
            item['dataValues']['name'] = name
            delete item['dataValues']['User']
            
        })
        //console.log(message[0].name);
        return res.status(200).json({ message: message})
        }
        

    }catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

//U
update_message = async (req, res) => {
    try {
        let token = req.headers.token || req.headers['x-access-token'];
        if(token) {            
            jwt.verify(token, process.env.JWT_SECRET, async(err, decoded)=> {
                if(err) {
                    return  res.status(402).json({ message: err });
                }else{
                    const message = await message_service.update_message(decoded["account"],xss(req.body.content),xss(req.body.id))
                    if(message[0]){                        
                        return res.status(200).json({ message: "修改成功" });
                    }else{
                        return res.status(400).json({ message: "修改失敗" });
                    }
                }
            })
        }
    }catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
//D
delete_message = async (req, res) => {
    try{
        let token = req.headers.token || req.headers['x-access-token'];
        if(token) {
            jwt.verify(token, process.env.JWT_SECRET, async(err, decoded)=> {
                if(err) {
                    return  res.status(402).json({ message: err });
                }else{
                    const message = await message_service.delete_message(req.body.id,decoded["account"])
                    if(message){                        
                        return res.status(200).json({ message: "刪除成功" });
                    }else{
                        return res.status(400).json({ message: "刪除失敗" });
                    }
                }
            })
        }
        
    }catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports = {
    create_message,
    read_message,
    update_message,
    delete_message
  };