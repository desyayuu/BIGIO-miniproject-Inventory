const request = require('supertest');
const app = require('../app'); 
const { 
    Transaction, 
    Barang, 
    Supplier
} = require('../models');


describe('Transaction API', () => {
    beforeAll(async () => {
        try {
            // Create associated records for testing
            await Barang.create({ idBarang: 1, namaBarang: 'Barang A', stok: 10, harga: 100 });
            await Supplier.create({ idSupplier:1, namaSupplier: 'Supplier A', noHp: '123456789', alamat: '123 Main St' });
            await Transaction.bulkCreate([
                { idTransaction: 1, idBarang: 1, idSupplier: 1, jenis: 'in', jumlah: 2 }
            ]);
        } catch (error) {
            console.error('Error during bulk creation:', error);
            throw error;
        }
    });

    afterAll(async () => {
        await Transaction.destroy({truncate: true, cascade: true});
        await Barang.destroy({truncate: true, cascade: true});
        await Supplier.destroy({truncate: true, cascade: true});
    });

    test('GET/transactions - return data transaction if success', async () => {
        const response = await request(app).get('/transactions');
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);

        response.body.forEach(transaction => {
            expect(transaction).toHaveProperty('Barang');
            expect(transaction).toHaveProperty('Supplier');
            expect(transaction.Barang).toHaveProperty('namaBarang');
            expect(transaction.Supplier).toHaveProperty('namaSupplier');
        });
    });

    //GET TRANSACTION
    test('GET /transactions/:id - should return a transaction by its ID', async () => {
        const transactionId = 1;
        const response = await request(app).get(`/transactions/${transactionId}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('idTransaction', transactionId);
        expect(response.body).toHaveProperty('Barang');
        expect(response.body).toHaveProperty('Supplier');
        expect(response.body.Barang).toHaveProperty('namaBarang', 'Barang A');
        expect(response.body.Supplier).toHaveProperty('namaSupplier', 'Supplier A');
        expect(response.body).toHaveProperty('jenis', 'in');
        expect(response.body).toHaveProperty('jumlah', 2);
    });

    test('GET /transactions/:id - should return 404 if transaction ID is not found', async () => {
        const nonExistentTransactionId = 999;
        const response = await request(app).get(`/transactions/${nonExistentTransactionId}`);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', `Transaksi dengan ID ${nonExistentTransactionId} tidak ditemukan!`);
    });

    //ADD TRANSACTION
    test('POST /transactions - jika berhasil add transaksi', async () => {
        const newTransaction = {
            idBarang: 1,
            namaBarang: 'Barang A',
            idSupplier: 1,
            namaSupplier: 'Supplier A',
            jumlah: 5,
            jenis: 'in'
        };

        const response = await request(app)
            .post('/transactions')
            .send(newTransaction);

        
        expect(response.status).toBe(201);
        console.log(response.body.transaction);
    });

    test('POST/transactions - return 400 data yang dimasukkan tidak lengkap', async () => {
        const incompleteTransaction = {
            idBarang: 1,
            namaSupplier: 'Supplier A',
            jumlah: 5,
            jenis: 'in'
        };
        const response = await request(app)
            .post('/transactions')
            .send(incompleteTransaction);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Harap lengkapi semua data yang diperlukan!');
    });

    test('POST/transactions - return 404 jika barang not found', async () => {
        const barangNotFound = {
            idBarang: 999,
            namaBarang: 'Barang X',
            idSupplier: 1,
            namaSupplier: 'Supplier A',
            jumlah: 5,
            jenis: 'in'
        };

        const response = await request(app)
            .post('/transactions')
            .send(barangNotFound);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Barang tidak ditemukan!');
    });


    test('should return 400 if stock is insufficient for transaction jenis "out"', async () => {
        const insufficientStockTransaction = {
            idBarang: 1,
            namaBarang: 'Barang A',
            idSupplier: 1,
            namaSupplier: 'Supplier A',
            jumlah: 9999, 
            jenis: 'out'
        };

        const response = await request(app)
            .post('/transactions')
            .send(insufficientStockTransaction);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Stok barang tidak mencukupi!');
    });

    test('should return 400 if jenis is invalid', async () => {
        const invalidJenisTransaction = {
            idBarang: 1,
            namaBarang: 'Barang A',
            idSupplier: 1,
            namaSupplier: 'Supplier A',
            jumlah: 5,
            jenis: 'invalid' 
        };

        const response = await request(app)
            .post('/transactions')
            .send(invalidJenisTransaction);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Jenis transaksi tidak valid!');
    });
    
    //PUT TRANSACTION
    test('PUT /transactions/:id - should edit transaction successfully', async () => {
        const editedData = {
            jumlah: 3,
            jenis: 'out'
        };

        const response = await request(app)
            .put('/transactions/1')
            .send(editedData);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Transaksi dengan ID 1 berhasil diedit!');
    });


    //DELETE
    test('DELETE /transactions/:id - jika sukses delete', async () => {
        const transactionId = 1;
        const response = await request(app).delete(`/transactions/${transactionId}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe(`Transaksi dengan ID ${transactionId} berhasil dihapus!`);
    });

    test('DELETE/transactions/:id - jika transaction tidak ditemukan', async()=>{
        const transactionId = 120; 
        const response = await request(app).delete(`/transactions/${transactionId}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe(`Transaksi dengan ID ${transactionId} tidak ditemukan!`);
    });


    //CATCH ERROR: 
    test('GET/transactions - jika error dan retrun 505 dengan error messagenya', async()=>{
        const getAllTransactions = Transaction.findAll; 
        Transaction.findAll = jest.fn(()=>{
            throw new Error('Database error occured');
        });

        const response = await request(app).get('/transactions');
        
        Transaction.findAll = getAllTransactions; 
        expect(response.status).toBe(500); 
        expect(response.body).toHaveProperty('error', 'Database error occured');
    });

    test('DELETE /transactions/:id - should handle server errors', async () => {
        const deleteTransaction = Transaction.destroy;
        Transaction.destroy = jest.fn(() => {
            throw new Error('Database error occurred');
        });

        const transactionId = 1;
        const response = await request(app).delete(`/transactions/${transactionId}`);

        Transaction.destroy = deleteTransaction;

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('error', 'Database error occurred');
    });

    test('PUT /transactions/:id - should handle server errors', async () => {
        const editTransaction = Transaction.findByPk;
        Transaction.findByPk = jest.fn(() => {
            throw new Error('Database error occurred');
        });

        const transactionId = 1;
        const updatedData = { 
            idBarang: 1, idSupplier: 1, jenis: 'in', jumlah: 2};
        const response = await request(app)
            .put(`/transactions/${transactionId}`)
            .send(updatedData);

        Transaction.findByPk = editTransaction;

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('error', 'Database error occurred');
    });


    
});
