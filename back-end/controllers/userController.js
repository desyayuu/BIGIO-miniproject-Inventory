const { User } = require('../models');
const bcrypt = require('bcryptjs');

exports.getAllUser= async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.addUser = async (req, res) => {
    try {
        if (!req.body.username || !req.body.password) {
            return res.status(400).json({ message: "username dan password tidak boleh kosong!" });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newUser = await User.create({
            username: req.body.username,
            password: hashedPassword
        });

        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};


exports.getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findByPk(id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: `User dengan ID ${id} tidak ditemukan!` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: `user dengan ID ${id} tidak ditemukan!` });
        }
        const updatedUser = await user.update(req.body);
        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};


exports.deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const numRowsDeleted = await User.destroy({ where: { id: id } });
        if (numRowsDeleted === 1) {
            res.json({ message: `User dengan ID ${id} berhasil dihapus!` });
        } else {
            res.status(404).json({ message: `User dengan ID ${id} tidak ditemukan!` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
