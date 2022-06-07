const user_service = require("../services/user.js");
const verify = require("../services/verify.js");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const xss = require('xss')


register = async (req, res) => {
  try {
    const have_user = await user_service.find_user(xss(req.body.account));  
    const is_mail = await verify.is_mail(xss(req.body.email)); 
    if (have_user) {
      return res.status(400).json({ message: "帳號已被使用" });
    }else if(!is_mail) {
      return res.status(400).json({ message: "信箱格式錯誤" });
    }
    else{
      const user = await user_service.register(xss(req.body.name),xss(req.body.account), xss(req.body.password), xss(req.body.email));
      if(user) {
        return res.status(201).json({ message: "新增成功" });
      }else{
        return res.status(400).json({ message: "新增失敗"})
      }
    }

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

login = async (req, res) => {
  try {
    const is_admin = await user_service.is_admin(req.body)
    if(is_admin && bcrypt.compareSync(req.body.password, is_admin.password)) {
      const token = await user_service.create_token(is_admin)
      return res.status(201).json({ message: "登入成功",token:token,name:is_admin.name,account:is_admin.account});
    } else {
      return res.status(401).json({ message: "帳號或密碼錯誤" });
    }

  }catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

find_user = async (req, res) => {
  try {
    let token = req.headers.token || req.headers['x-access-token'];
    if(token) {            
      jwt.verify(token, process.env.JWT_SECRET, async(err, decoded)=> {
          if(err) {
              return  res.status(402).json({ message: err });
          }else{
            const is_admin = await user_service.find_user(decoded["account"])
              if(is_admin){                        
                return res.status(200).json({ message: is_admin }); 
              }else{
                return res.status(400).json({ message: "帳號錯誤" });
              }
          }
      })
  }   

  }catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

update_user = async (req, res) => {
  try {
    let token = req.headers.token || req.headers['x-access-token'];
    const is_mail = await verify.is_mail(xss(req.body.email));
    if(token) {  
      jwt.verify(token, process.env.JWT_SECRET, async(err, decoded)=> {
          if(err) {
              return  res.status(402).json({ message: err });
          }else if(!is_mail) {
            return res.status(400).json({ message: "信箱格式錯誤" });
          }else{
            const is_admin = await user_service.update_user(decoded["account"],xss(req.body.email),xss(req.body.name))
              if(is_admin[0]){                       
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

module.exports = {
  register,
  login,
  find_user,
  update_user
};
