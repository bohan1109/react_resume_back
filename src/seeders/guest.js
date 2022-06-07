"use strict";
const bcrypt = require("bcrypt");
require("dotenv").config();


// npx sequelize db:seed:all
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          account: process.env.GUEST_ACCOUNT,
          name: process.env.GUEST_NAME,
          password: bcrypt.hashSync(process.env.GUEST_PASSWORD, 10),
          email: process.env.EMAIL,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Admins", null, {});
  },
};