'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Transaction.belongsTo(models.Barang, {
        foreignKey: "idBarang", 
        onDelete: "SET NULL",
        onUpdate: "CASCADE"
      })
      Transaction.belongsTo(models.Supplier, {
        foreignKey: "idSupplier", 
        onDelete: "SET NULL", 
        onUpdate: "CASCADE"
      })
    }
  }
  Transaction.init({
    idTransaction: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    idBarang: DataTypes.INTEGER,
    idSupplier: DataTypes.INTEGER,
    jenis: DataTypes.STRING,
    jumlah: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE 
  }, {
    sequelize,
    modelName: 'Transaction',
    paranoid: true 
  });
  return Transaction;
};