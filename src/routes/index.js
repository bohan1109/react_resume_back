const user_controller = require("../controller/user.js");
const message_controller = require("../controller/message.js");
const token_authentication_middleware = require("../middleware/token_authentication");


module.exports = function (router) {
  router.get("/", (req, res) => {
    res.send("Hello World!");
  });
  router.post("/api/user", user_controller.register);

  router.post("/api/login", user_controller.login);

  //app.post('/auth/google', async (req, res) => {})
  

  //message
  router.post("/api/message", message_controller.create_message);

  router.get("/api/message",message_controller.read_message);

  router.use(token_authentication_middleware);

  router.put("/api/message", message_controller.update_message);

  router.delete("/api/message", message_controller.delete_message);

  //user
  router.get("/api/user", user_controller.find_user)

  router.put("/api/user", user_controller.update_user)




};
