const { Transaction, Barang, Supplier } = require('../models');

exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.findAll({
            include: [{ model: Barang }, { model: Supplier }]
        });
        res.json(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.addTransaction = async (req, res) => {
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
                    newStock = existingBarang.stok + parseInt(req.body.jumlah);
                } else if (req.body.jenis === 'out') {
                    if (existingBarang.stok < req.body.jumlah) {
                        return res.status(400).json({ message: "Stok barang tidak mencukupi!" });
                    }
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
};

exports.getTransactionById = async (req, res) => {
    try {
        const id = req.params.id;
        const transaction = await Transaction.findByPk(id, {
            include: [{ model: Barang }, { model: Supplier }]
        });
        if (transaction) {
            res.json(transaction);
        } else {
            res.status(404).json({ message: `Transaksi dengan ID ${id} tidak ditemukan!` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.editTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { jumlah, jenis } = req.body;

        if (!jumlah || !jenis) {
            return res.status(400).json({
                message: "Harap lengkapi jumlah dan jenis transaksi!"
            });
        }

        const transaction = await Transaction.findByPk(id);
        if (!transaction) {
            return res.status(404).json({ message: `Transaksi dengan ID ${id} tidak ditemukan!` });
        }

        const barang = await Barang.findByPk(transaction.idBarang);
        if (!barang) {
            return res.status(404).json({ message: "Barang tidak ditemukan!" });
        }

        // Hitung stok sebelum transaksi
        let stockBeforeTransaction = barang.stok;

        // Perhitungan stok baru berdasarkan jenis transaksi
        let newStock = stockBeforeTransaction;
        if (transaction.jenis === 'in') {
            // Kurangkan stok transaksi sebelumnya jika itu adalah transaksi masuk
            newStock -= transaction.jumlah;
        } else if (transaction.jenis === 'out') {
            // Tambahkan stok transaksi sebelumnya jika itu adalah transaksi keluar
            newStock += transaction.jumlah;
        }

        if (jenis === 'in') {
            // Tambahkan jumlah transaksi baru jika itu adalah transaksi masuk
            newStock += jumlah;
        } else if (jenis === 'out') {
            // Kurangkan jumlah transaksi baru jika itu adalah transaksi keluar
            newStock -= jumlah;
        }

        // Perbarui stok barang
        await Barang.update({ stok: newStock }, { where: { idBarang: transaction.idBarang } });

        // Perbarui transaksi
        await Transaction.update({ jumlah, jenis }, { where: { idTransaction: id } });

        res.json({ message: `Transaksi dengan ID ${id} berhasil diedit!` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};




exports.deleteTransaction = async (req, res) => {
    try {
        const id = req.params.id;
        const numRowsDeleted = await Transaction.destroy({ where: { idTransaction: id } });
        if (numRowsDeleted === 1) {
            res.json({ message: `Transaksi dengan ID ${id} berhasil dihapus!` });
        } else {
            res.status(404).json({ message: `Transaksi dengan ID ${id} tidak ditemukan!` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
