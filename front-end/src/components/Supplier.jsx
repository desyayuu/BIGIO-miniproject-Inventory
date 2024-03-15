import React, { useState, useEffect } from "react";
import { Banner, Table, Button, Label, Modal, TextInput } from 'flowbite-react';

export default function Supplier() {
    const [openModalAdd, setOpenModalAdd] = useState(false);
    const [formData, setFormData] = useState({ namaSupplier: '', noHp: '', alamat: '' });
    const [formEditSupplier, setFormEditSupplier] = useState({ namaSupplier: '', noHp: '', alamat: '' });
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [suppliers, setSuppliers] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState(null);

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const response = await fetch('http://localhost:4000/suppliers');
            if (response.ok) {
                const data = await response.json();
                setSuppliers(data);
            }
        } catch (error) {
            console.error('Error fetching suppliers:', error);
        }
    };

    const handleAddSupplier = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:4000/suppliers', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
    
            if (res.ok) {
                console.log('success');
                setOpenModalAdd(false);
                fetchSuppliers();
                setFormData({ namaSupplier: '', noHp: '', alamat: '' }); // Mengatur nilai input kembali ke string kosong setelah menambahkan supplier
            }
        } catch (error) {
            console.error('Error adding supplier:', error);
        }
    };

    const handleEditButtonSupplier = (supplier) => {
        setSelectedSupplier(supplier);
        setFormEditSupplier(supplier);
        setOpenModalEdit(true);
    };

    const handleEditSupplier = async (e) => {
        e.preventDefault();
        try {
            const dataWithId = { ...formEditSupplier, idSupplier: selectedSupplier.idSupplier };
            const res = await fetch(`http://localhost:4000/suppliers/${selectedSupplier.idSupplier}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataWithId), // Menggunakan dataWithId
            });
    
            if (res.ok) {
                console.log('success');
                setOpenModalEdit(false);
                fetchSuppliers();
            }
        } catch (error) {
            console.error('Error editing supplier:', error);
        }
    };

    const handleDeleteSupplier = async (supplier) => {
        try {
            const res = await fetch(`http://localhost:4000/suppliers/${supplier.idSupplier}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (res.ok) {
                console.log('success');
                fetchSuppliers();
            }
        } catch (error) {
            console.error('Error deleting supplier:', error);
        }
    };

    function onCloseModal() {
        setOpenModalAdd(false);
        setOpenModalEdit(false);
    }

    return (
        <Banner>
            <div className="px-10 flex w-full flex-col justify-between p-4 dark:border-gray-600 dark:bg-gray-700 md:flex-row">
                <h2 className="mb-1 text-base font-semibold text-gray-900 dark:text-white">Data Supplier</h2>
            </div>
            <div className="px-10 mb-5">
                <Button className="customButton" onClick={() => setOpenModalAdd(true)}>Add Supplier</Button>
            </div>
            <Modal show={openModalAdd} size="md" onClose={onCloseModal} popup>
                <Modal.Header />
                <Modal.Body>
                    <form onSubmit={handleAddSupplier} className="space-y-6">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">Tambah Supplier</h3>
                        <div className="space-y-6">
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="nama" value="Nama Supplier" />
                                </div>
                                <TextInput id="namaBarang" value={formData.namaSupplier} onChange={(e) => setFormData({ ...formData, namaSupplier: e.target.value })} required />
                                <div className="mb-2 block">
                                    <Label htmlFor="noHp" value="No HP" />
                                </div>
                                <TextInput id="noHp" value={formData.noHp} onChange={(e) => setFormData({ ...formData, noHp: e.target.value })} required />
                                <div className="mb-2 block">
                                    <Label htmlFor="alamat" value="Alamat" />
                                </div>
                                <TextInput id="alamat" value={formData.alamat} onChange={(e) => setFormData({ ...formData, alamat: e.target.value })} required />
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
                        <Table.HeadCell>Nama Supplier</Table.HeadCell>
                        <Table.HeadCell>No HP</Table.HeadCell>
                        <Table.HeadCell>Alamat</Table.HeadCell>
                        <Table.HeadCell>Action</Table.HeadCell>
                        <Table.HeadCell>
                            <span className="sr-only">Edit</span>
                        </Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {suppliers.map((supplier) => (
                            <Table.Row key={supplier.idSupplier} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {supplier.idSupplier}
                                </Table.Cell>
                                <Table.Cell>{supplier.namaSupplier}</Table.Cell>
                                <Table.Cell>{supplier.noHp}</Table.Cell>
                                <Table.Cell>{supplier.alamat}</Table.Cell>
                                <Table.Cell className="flex items-center gap-4">
                                    <Button className="editDeleteButton" onClick={() => handleEditButtonSupplier(supplier)}>Edit</Button>
                                    <Button className="editDeleteButton" color="failure" onClick={() => handleDeleteSupplier(supplier)}>Hapus</Button>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>
            <Modal show={openModalEdit} size="md" onClose={onCloseModal} popup>
                <Modal.Header />
                <Modal.Body>
                    <form onSubmit={handleEditSupplier} className="space-y-6">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">Edit Supplier</h3>
                        <form onSubmit={handleEditSupplier}  className="space-y-6">
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="namaNow" value="Nama" />
                                </div>
                                <TextInput id="namaNow" value={formEditSupplier.namaSupplier} onChange={(e) => setFormEditSupplier({ ...formEditSupplier, namaSupplier: e.target.value })} />
                                <div className="mb-2 block">
                                    <Label htmlFor="hargaNow" value="Harga" />
                                </div>
                                <TextInput id="hargaNow" value={formEditSupplier.noHp} onChange={(e) => setFormEditSupplier({ ...formEditSupplier, noHp: e.target.value })} />
                                <div className="mb-2 block">
                                    <Label htmlFor="stokNow" value="Stok" />
                                </div>
                                <TextInput id="stokNow" value={formEditSupplier.alamat} onChange={(e) => setFormEditSupplier({ ...formEditSupplier, alamat: e.target.value })} />
                            </div>
                        </form>
                        <div className="w-full">
                            <Button type="submit">Simpan</Button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </Banner>
    );
}
