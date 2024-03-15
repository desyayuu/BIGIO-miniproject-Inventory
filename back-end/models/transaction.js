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
        foreignKey: "idBarang"
      })
      Transaction.belongsTo(models.Supplier, {
        foreignKey: "idSupplier"
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
    idBarang:{
      type:DataTypes.INTEGER, 
      allowNull: false, 
      references: {
        model:"Barang",
      }, 
      onUpdate: "CASCADE", 
      onDelete: "CASCADE" 
    },
    idSupplier:{
      type:DataTypes.INTEGER, 
      allowNull: false, 
      references: {
        model:"Supplier",
      },
      onUpdate: "CASCADE", 
      onDelete: "CASCADE" 
    },
    jenis: DataTypes.STRING,
    jumlah: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};