is_mail = async (mail) => {
    const regex =
      /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!regex.test(mail)) {
      return false;
    } else {
      return true;
    }
  };
  
  module.exports = {
    is_mail,
  };