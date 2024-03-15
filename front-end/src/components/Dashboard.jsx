import React, { useState, useEffect } from "react";
import './style.css';
import { Banner } from "flowbite-react";
import { Table } from "flowbite-react";

export default function Dashboard(){
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        fetch('http://localhost:4000/transactions')
            .then(response => response.json())
            .then(data => setTransactions(data))
            .catch(error => console.error('Error fetching transactions:', error));
    }, []);

    return (
        <Banner>
            <div className="px-10 flex w-full flex-col justify-between p-4 dark:border-gray-600 dark:bg-gray-700 md:flex-row">
                <h2 className="mb-1 text-base font-semibold text-gray-900 dark:text-white">Dashboard</h2>
            </div>

            <div className="px-10 flex w-full md:flex-row">
                <div className="overflow-x-auto md:ml-4 mt-4 md:mt-0">
                    <Table>
                        <Table.Head>
                            <Table.HeadCell>ID Transaksi</Table.HeadCell>
                            <Table.HeadCell>ID Barang</Table.HeadCell>
                            <Table.HeadCell>Nama Barang</Table.HeadCell>
                            <Table.HeadCell>ID Supplier</Table.HeadCell>
                            <Table.HeadCell>Nama Supplier</Table.HeadCell>
                            <Table.HeadCell>Jenis</Table.HeadCell>
                            <Table.HeadCell>Jumlah</Table.HeadCell>
                            <Table.HeadCell>Date</Table.HeadCell>
                        </Table.Head>
                        <Table.Body className="divide-y">
                            {/* Map melalui data transaksi dan tampilkan di tabel */}
                            {transactions.map(transaction => (
                                <Table.Row key={transaction.idTransaction} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell>{transaction.idTransaction}</Table.Cell>
                                    <Table.Cell>{transaction.idBarang}</Table.Cell>
                                    <Table.Cell>{transaction.Barang.namaBarang}</Table.Cell> 
                                    <Table.Cell>{transaction.idSupplier}</Table.Cell>
                                    <Table.Cell>{transaction.Supplier ? transaction.Supplier.namaSupplier : ''}</Table.Cell> 
                                    <Table.Cell>{transaction.jenis}</Table.Cell>
                                    <Table.Cell>{transaction.jumlah}</Table.Cell>
                                    <Table.Cell>{new Date(transaction.createdAt).toLocaleString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}</Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </div>
            </div>
        </Banner>
    );
}