'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Suppliers', {
      idSupplier: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      namaSupplier: {
        type: Sequelize.STRING
      },
      noHp: {
        type: Sequelize.STRING
      },
      alamat: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE 
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Suppliers');
  }
};
