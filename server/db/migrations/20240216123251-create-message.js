"use strict";
/** @type {import('sequelize-cli').Migration} */
const moment = require("moment");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = moment().format("HH:mm"); 
    await queryInterface.createTable("Messages", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      time: {
        type: Sequelize.TEXT,
        defaultValue: now, 
        allowNull: false,
      },
      sender: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      text: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Messages");
  },
};
