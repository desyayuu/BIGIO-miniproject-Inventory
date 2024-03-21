const { Supplier } = require('../models');

exports.getAllSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.findAll();
        res.json(suppliers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.addSupplier = async (req, res) => {
    try {
        if (!req.body.namaSupplier) {
            return res.status(400).json({ message: "Nama supplier tidak boleh kosong!" });
        }
        const newSupplier = await Supplier.create(req.body);
        res.status(201).json(newSupplier);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.getSupplierById = async (req, res) => {
    try {
        const id = req.params.id;
        const supplier = await Supplier.findByPk(id);
        if (supplier) {
            res.json(supplier);
        } else {
            res.status(404).json({ error: `Supplier dengan ID ${id} tidak ditemukan!` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.updateSupplier = async (req, res) => {
    try {
        const id = req.params.id;
        const supplier = await Supplier.findByPk(id);
        if (!supplier) {
            return res.status(404).json({ error: `Supplier dengan ID ${id} tidak ditemukan!` });
        }
        const updatedSupplier = await supplier.update(req.body);
        res.json(updatedSupplier);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};


exports.deleteSupplier = async (req, res) => {
    try {
        const id = req.params.id;
        const numRowsDeleted = await Supplier.destroy({ where: { idSupplier: id } });
        if (numRowsDeleted === 1) {
            res.json({ message: `Supplier dengan ID ${id} berhasil dihapus!` });
        } else {
            res.status(404).json({ message: `Supplier dengan ID ${id} tidak ditemukan!` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
