'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Barang extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Barang.hasMany(models.Transaction, {
        foreignKey: 'idBarang',
        as: 'transactions' // Define an alias for the association
      });
    }
  }
  Barang.init({
    idBarang: {
      type: DataTypes.INTEGER,
      primaryKey: true, 
      autoIncrement: true, 
      allowNull: false
    },
    namaBarang: DataTypes.STRING,
    stok: {
      type: DataTypes.INTEGER,
      defaultValue:0
    },
    harga: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Barang',
  });
  return Barang;
};