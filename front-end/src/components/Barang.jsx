import React, { useState, useEffect } from "react";
import { Banner, Table, Button, Label, Modal, TextInput } from 'flowbite-react';
import './style.css';

export default function Barang() {
    const [openModalAdd, setOpenModalAdd] = useState(false);
    const [formData, setFormData] = useState({ namaBarang: '', harga: '', stok: '' });
    const [formEditData, setFormEditData] = useState({ idBarang: '', namaBarang: '', harga: '', stok: '' });
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [barangs, setBarangs] = useState([]);
    const [selectedBarang, setSelectedBarang] = useState(null);

    useEffect(() => {
        fetchBarangs();
    }, []);

    const fetchBarangs = async () => {
        try {
            const response = await fetch('http://localhost:4000/barangs');
            if (response.ok) {
                const data = await response.json();
                setBarangs(data);
            }
        } catch (error) {
            console.error('Error fetching barangs:', error);
        }
    };

    const handleAddBarang = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:4000/barangs', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                console.log('success');
                setOpenModalAdd(false);
                fetchBarangs();
            }
        } catch (error) {
            console.error('Error adding barang:', error);
        }
    };

    const handleEditButtonBarang = (barang) => {
        setSelectedBarang(barang);
        setFormEditData(barang);
        setOpenModalEdit(true);
    };

    const handleEditBarang = async (e) => {
        e.preventDefault();
        try {
            const dataWithId = { ...formEditData, idBarang: selectedBarang.idBarang };
            const res = await fetch(`http://localhost:4000/barangs/${selectedBarang.idBarang}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataWithId), // Menggunakan dataWithId
            });
    
            if (res.ok) {
                console.log('success');
                setOpenModalEdit(false);
                fetchBarangs();
            }
        } catch (error) {
            console.error('Error editing barang:', error);
        }
    }
    

    const handleDeleteBarang = async (barang) => {
        try {
            const res = await fetch(`http://localhost:4000/barangs/${barang.idBarang}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (res.ok) {
                console.log('success');
                fetchBarangs();
            }
        } catch (error) {
            console.error('Error deleting barang:', error);
        }
    }
    

    function onCloseModal() {
        setOpenModalAdd(false);
        setOpenModalEdit(false);
    }

    return (
        <Banner>
            <div className="px-10 flex w-full flex-col justify-between p-4 dark:border-gray-600 dark:bg-gray-700 md:flex-row">
                <h2 className="mb-1 text-base font-semibold text-gray-900 dark:text-white">Data Barang</h2>
            </div>
            <div className="px-10 mb-5">
                <Button className="customButton" onClick={() => setOpenModalAdd(true)}>Tambah Barang</Button>
            </div>
            <Modal show={openModalAdd} size="md" onClose={onCloseModal} popup>
                <Modal.Header />
                <Modal.Body>
                    <form onSubmit={handleAddBarang} className="space-y-6">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">Tambah Barang</h3>
                        <div className="space-y-6">
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="nama" value="Nama" />
                                </div>
                                <TextInput id="namaBarang" onChange={(e) => setFormData({ ...formData, namaBarang: e.target.value })} required />
                                <div className="mb-2 block">
                                    <Label htmlFor="harga" value="Harga" />
                                </div>
                                <TextInput id="harga" onChange={(e) => setFormData({ ...formData, harga: e.target.value })} required />
                                <div className="mb-2 block">
                                    <Label htmlFor="stok" value="Stok" />
                                </div>
                                <TextInput id="stok" onChange={(e) => setFormData({ ...formData, stok: e.target.value })} required />
                            </div>
                        </div>
                        <div className="w-full">
                            <Button type="submit">Tambah</Button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
            <div className="px-10 overflow-x-auto">
                <Table striped>
                    <Table.Head>
                        <Table.HeadCell>ID</Table.HeadCell>
                        <Table.HeadCell>Nama Barang</Table.HeadCell>
                        <Table.HeadCell>Harga</Table.HeadCell>
                        <Table.HeadCell>Stok</Table.HeadCell>
                        <Table.HeadCell>Action</Table.HeadCell>
                        <Table.HeadCell>
                            <span className="sr-only">Edit</span>
                        </Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {barangs.map((barang) => (
                            <Table.Row key={barang.idBarang} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <Table.Cell>{barang.idBarang}</Table.Cell>
                                <Table.Cell>{barang.namaBarang}</Table.Cell>
                                <Table.Cell>{barang.harga}</Table.Cell>
                                <Table.Cell>{barang.stok}</Table.Cell>
                                <Table.Cell className="flex items-center gap-4">
                                    <Button className="editDeleteButton" onClick={() => handleEditButtonBarang(barang)}>Edit</Button>
                                    <Button className="editDeleteButton" color="failure" onClick={() => handleDeleteBarang(barang)}>Hapus</Button>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>
            <Modal show={openModalEdit} size="md" onClose={onCloseModal} popup>
                <Modal.Header />
                <Modal.Body>
                    <form onSubmit={handleEditBarang} className="space-y-6">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">Edit Barang</h3>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="namaNow" value="Nama" />
                            </div>
                            <TextInput id="namaNow" value={formEditData.namaBarang} onChange={(e) => setFormEditData({ ...formEditData, namaBarang: e.target.value })} />
                            <div className="mb-2 block">
                                <Label htmlFor="hargaNow" value="Harga" />
                            </div>
                            <TextInput id="hargaNow" value={formEditData.harga} onChange={(e) => setFormEditData({ ...formEditData, harga: e.target.value })} />
                            <div className="mb-2 block">
                                <Label htmlFor="stokNow" value="Stok" />
                            </div>
                            <TextInput id="stokNow" value={formEditData.stok} onChange={(e) => setFormEditData({ ...formEditData, stok: e.target.value })} />
                        </div>
                        <div className="w-full">
                            <Button type="submit">Simpan</Button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </Banner>
    );
}
