const db = require("../models");
const Barang = db.barangs;
const { Op } = db.Sequelize;

// Create and Save a new Barang
exports.create = (req, res) => {
    if (!req.body.namaBarang || !req.body.stok || !req.body.harga) {
        res.status(400).send({
            message: "Nama barang, stok, dan harga tidak boleh kosong!"
        });
        return;
    }
      
    const barang = {
        namaBarang: req.body.namaBarang,
        stok: req.body.stok,
        harga: req.body.harga
    };
    
    // Save Barang in the database
    Barang.create(barang)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Terjadi kesalahan saat membuat barang."
            });
        });
};

// Retrieve all Barangs from the database.
exports.findAll = (req, res) => {
  const namaBarang = req.query.namaBarang;
  var condition = namaBarang ? { namaBarang: { [Op.iLike]: `%${namaBarang}%` } } : null;

  Barang.findAll({ where: condition })
      .then(data => {
          res.send(data);
      })
      .catch(err => {
          res.status(500).send({
              message: err.message || "Some error occurred while retrieving barangs."
          });
      });
};


exports.findOne = (req, res) => {
  const id = req.params.id;

  Barang.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Barang with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Barang with id=" + id
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  Barang.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Barang was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Barang with id=${id}. Maybe Barang was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Barang with id=" + id
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Barang.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Barang was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Barang with id=${id}. Maybe Barang was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Barang with id=" + id
      });
    });
};

