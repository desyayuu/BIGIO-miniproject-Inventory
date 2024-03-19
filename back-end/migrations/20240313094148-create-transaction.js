'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Transactions', {
      idTransaction: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER 
      },
      idBarang: {
        type: Sequelize.INTEGER, 
        references: {
          model:"Barangs",
          key:"idBarang"
        },
        onUpdate: "CASCADE", 
        onDelete: "SET NULL" 
      },
      idSupplier: {
        type: Sequelize.INTEGER, 
        references: {
          model:"Suppliers",
          key:"idSupplier"
        },
        onUpdate: "CASCADE", 
        onDelete: "SET NULL" 
      },
      jenis: {
        type: Sequelize.STRING
      },
      jumlah: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('Transactions');
  }
};
