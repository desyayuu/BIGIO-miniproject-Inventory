const { Barang } = require('../models');

exports.getAllBarangs = async (req, res) => {
    try {
        const barangs = await Barang.findAll();
        res.json(barangs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.addBarang = async (req, res) => {
    try {
        if (!req.body.namaBarang) {
            return res.status(400).json({ message: "Nama barang tidak boleh kosong!" });
        }
        const newBarang = await Barang.create(req.body);
        res.status(201).json(newBarang);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.getBarangById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const barang = await Barang.findByPk(id);
        if (!barang) {
            return res.status(404).json({ error: 'Barang not found' });
        }
        res.json(barang);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};


exports.updateBarang = async (req, res) => {
    try {
        const id = req.params.id;
        const barang = await Barang.findByPk(id);
        if (!barang) {
            return res.status(404).json({ message: `Barang dengan ID ${id} tidak ditemukan!` });
        }
        const updatedBarang = await barang.update(req.body);
        res.json(updatedBarang);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.deleteBarang = async (req, res) => {
    try {
        const id = req.params.id;
        const numRowsDeleted = await Barang.destroy({ where: { idBarang: id } });
        if (numRowsDeleted === 1) {
            res.json({ message: `Barang dengan ID ${id} berhasil dihapus!` });
        } else {
            res.status(404).json({ message: `Barang dengan ID ${id} tidak ditemukan!` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
