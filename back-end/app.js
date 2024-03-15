const express = require("express");
const app = express();
const port = 4000;
const { Transaction, Barang, Supplier } = require("./models");
const { route } = require("./routes/barang.routes");
const transaction = require("./models/transaction");

const cors = require('cors');
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});

app.get("/test", async (req, res) => {
    try {
        console.log("selamat datang")
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

//TRANSACTION//
app.get("/transactions", async (req, res) => {
    try {
        const transaction = await Transaction.findAll({
            include: [
                { model: Barang },
                { model: Supplier }
            ],
        });
        res.json(transaction);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

app.post("/transactions", async (req, res) => {
    try {
        if (!req.body.idBarang || !req.body.namaBarang || !req.body.idSupplier || !req.body.namaSupplier || !req.body.jumlah || !req.body.jenis) {
            return res.status(400).json({
                message: "Harap lengkapi semua data yang diperlukan!"
            });
        }

        const existingBarang = await Barang.findByPk(req.body.idBarang);
        if (!existingBarang) {
            return res.status(404).json({ message: "Barang tidak ditemukan!" });
        }

        let newStock;
        if (req.body.jenis === 'in') {
            // Hitung stok baru, menambahkan jumlah transaksi
            newStock = existingBarang.stok + parseInt(req.body.jumlah);
        } else if (req.body.jenis === 'out') {
            if (existingBarang.stok < req.body.jumlah) {
                return res.status(400).json({ message: "Stok barang tidak mencukupi!" });
            }
            // Hitung stok baru, mengurangkan jumlah transaksi
            newStock = existingBarang.stok - parseInt(req.body.jumlah);
        } else {
            return res.status(400).json({ message: "Jenis transaksi tidak valid!" });
        }

        await Barang.update({ stok: newStock }, { where: { idBarang: req.body.idBarang } });

        const newTransaction = await Transaction.create({
            idBarang: req.body.idBarang,
            namaBarang: req.body.namaBarang,
            idSupplier:req.body.idSupplier,
            namaSupplier: req.body.namaSupplier,
            jumlah: parseInt(req.body.jumlah),
            jenis: req.body.jenis
        });

        res.status(201).json(newTransaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});



app.put("/barangs/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const existingBarang = await Barang.findByPk(id);

        if (!existingBarang) {
            return res.status(404).send({
                message: `Cannot update Barang with id=${id}. Barang not found.`
            });
        }
        const updatedBarang = await existingBarang.update(req.body);

        res.send({
            message: "Barang was updated successfully.",
            barang: updatedBarang
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: "Error updating Barang with id=" + req.params.id
        });
    }
});


app.get("/transactions/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Transaction.findByPk(id);

        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
            message: `Cannot find Transaction with id=${id}.`});
        }
    }catch (err) {
        console.error(err);
        res.status(500).send({
          message: "Error retrieving Barang with id=" + req.params.id
        });
      }
});

// app.delete("/transactions/:id", async (req, res) => {
//     try {
//         const id = req.params.id;
//         const numRowsDeleted = await Transaction.destroy({
//             where: { idTransaction: id }
//         });

//         if (numRowsDeleted === 1) {
//             res.status(200).json({ message: "Transaction with id " + id + " was deleted successfully." });
//         } else {
//             res.status(404).json({ message: "Transaction with id " + id + " not found." });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Internal server error." });
//     }
// });



// BARANG //
app.get("/barangs", async (req, res) => {
    try {
        const barang = await Barang.findAll({
        });
        res.json(barang);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

app.post("/barangs", async (req, res) => {
    try {
        if (!req.body.namaBarang) {
            return res.status(400).json({
                message: "Nama barang tidak boleh kosong!"
            });
        }
        const barang = {
            namaBarang: req.body.namaBarang,
            stok: req.body.stok,
            harga: req.body.harga
        };
        const newBarang = await Barang.create(barang);
        res.status(201).json(newBarang);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.get("/barangs/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Barang.findByPk(id);

        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
            message: `Cannot find Barang with id=${id}.`});
        }
    }catch (err) {
        console.error(err);
        res.status(500).send({
          message: "Error retrieving Barang with id=" + req.params.id
        });
      }
});

app.put("/barangs/:id", async (req, res) => {
    try {
        const id = req.params.id;
        Barang.update(req.body, {
            where: { idBarang: id }
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
      } catch (error) {
        console.error(error);
        res.status(500).send({
          message: "Error updating Barang with id=" + req.params.id
        });
      }
});

app.delete("/barangs/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const numRowsDeleted = await Barang.destroy({
            where: { idBarang: id }
        });

        if (numRowsDeleted === 1) {
            res.status(200).json({ message: "Barang with id " + id + " was deleted successfully." });
        } else {
            res.status(404).json({ message: "Barang with id " + id + " not found." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
});


// SUPPLIER //
app.get("/suppliers", async (req, res) => {
    try {
        const supplier = await Supplier.findAll({
        });
        res.json(supplier);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

app.get("/suppliers/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Supplier.findByPk(id);

        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
            message: `Cannot find Supplier with id=${id}.`});
        }
    }catch (err) {
        console.error(err);
        res.status(500).send({
          message: "Error retrieving Supplier with id=" + req.params.id
        });
      }
});

app.post("/suppliers", async (req, res) => {
    try {
        if (!req.body.namaSupplier) {
            return res.status(400).json({
                message: "Nama supplier tidak boleh kosong!"
            });
        }
        const supplier = {
            namaSupplier: req.body.namaSupplier,
            noHp: req.body.noHp,
            alamat: req.body.alamat
        };
        const newSupplier = await Supplier.create(supplier);
        res.status(201).json(newSupplier);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.put("/suppliers/:id", async (req, res) => {
    try {
        const id = req.params.id;
        Supplier.update(req.body, {
            where: { idSupplier: id }
        })
        .then(num => {
            if (num == 1) {
              res.send({
                message: "Supplier was updated successfully."
              });
            } else {
              res.send({
                message: `Cannot update Supplier with id=${id}. Maybe Supplier was not found or req.body is empty!`
              });
            }
          })
      } catch (error) {
        console.error(error);
        res.status(500).send({
          message: "Error updating Supplier with id=" + req.params.id
        });
      }
});


app.delete("/suppliers/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const numRowsDeleted = await Supplier.destroy({
            where: { idSupplier: id }
        });

        if (numRowsDeleted === 1) {
            res.status(200).json({ message: "Supplier with id " + id + " was deleted successfully." });
        } else {
            res.status(404).json({ message: "Supplier with id " + id + " not found." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
});