const request = require('supertest');
const app = require('../app');
const { Barang } = require('../models');

describe('API Barang', () => {
    beforeAll(async () => {
        await Barang.bulkCreate([
            { idBarang: 1, namaBarang: 'Barang A', stok: 10, harga: 50000 },
            { idBarang: 2, namaBarang: 'Barang B', stok: 20, harga: 75000 }
        ]);
    });

    afterAll(async () => {
        await Barang.destroy({ truncate: true, cascade: true }); 
    });

    //GET ALL BARANG 
    test('GET /barangs', async () => {
        const response = await request(app).get('/barangs');
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2);
    });

    //GET Barang By Id
    test('GET /barangs/:id - jika sukses edit barang', async () => {
        const barangId = 1;
        const response = await request(app).get(`/barangs/${barangId}`);

        expect(response.status).toBe(200);
        expect(response.body.idBarang).toBe(1);
        expect(response.body.namaBarang).toBe('Barang A');
        expect(response.body.stok).toBe(10);
        expect(response.body.harga).toBe(50000);
    });

    test('GET /barangs/:id - jika barang tidak ditemukan', async () => {
        const barangId = 999;
        const response = await request(app).get(`/barangs/${barangId}`);

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Barang not found');
    });

    //ADD BARANG
    test('POST/barangs - should add and show new barang', async()=>{
        const response = await request(app)
            .post('/barangs')
            .send({ 
                namaBarang:"Barang C", 
                stok: 10, 
                harga: 80000
            });
        expect(response.status).toBe(201); 
        expect(response.body).toHaveProperty('idBarang');
        expect(response.body.namaBarang).toBe('Barang C');
        expect(response.body.stok).toBe(10);
        expect(response.body.harga).toBe(80000);
    });

    test('POST/barangs - should be 404 if null nama barang', async()=>{
        const response = await request(app)
            .post('/barangs')
            .send({ 
                stok: 12, 
                harga: 80000
            });
        expect(response.status).toBe(400); 
        expect(response.body).toEqual({message: 'Nama barang tidak boleh kosong!'});
    }); 

    //EDIT BARANG 
    test('PUT/barangs/:id', async()=>{
        const barangId = 1;
        const updatedData = { 
            namaBarang: 'Barang Updated', 
            stok: 15, 
            harga: 60000 };
        const response = await request(app)
            .put(`/barangs/${barangId}`)
            .send(updatedData);

        expect(response.status).toBe(200);
        expect(response.body.idBarang).toBe(barangId);
        expect(response.body.namaBarang).toBe(updatedData.namaBarang);
        expect(response.body.stok).toBe(updatedData.stok);
        expect(response.body.harga).toBe(updatedData.harga);
    }); 

    test('PUT /barangs/:id - jika barang not found', async () => {
        const barangId = 999; 
        const updatedData = { namaBarang: 'Barang Updated', stok: 15, harga: 60000 };
        const response = await request(app)
            .put(`/barangs/${barangId}`)
            .send(updatedData);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe(`Barang dengan ID ${barangId} tidak ditemukan!`);
    });

    // DELETE
    test('DELETE /barangs/:id - jika sukses delete', async () => {
        const barangId = 1;
        const response = await request(app).delete(`/barangs/${barangId}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe(`Barang dengan ID ${barangId} berhasil dihapus!`);
    });

    test('DELETE/barangs/:id - jika barang tidak ditemukan', async()=>{
        const barangId = 120; 
        const response = await request(app).delete(`/barangs/${barangId}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe(`Barang dengan ID ${barangId} tidak ditemukan!`);
    });

    //CATCH ERROR
    test('GET /barangs/:id - handle server errors', async () => {
        const fingBarangById = Barang.findByPk;
        Barang.findByPk = jest.fn(() => {
            throw new Error('Database error occurred');
        });

        const barangId = 1;
        const response = await request(app).get(`/barangs/${barangId}`);

        Barang.findByPk = fingBarangById;

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('error', 'Database error occurred');
    });

    test('POST /barangs - should handle server errors', async () => {
        const createBarang = Barang.create;
        Barang.create = jest.fn(() => {
            throw new Error('Database error occurred');
        });

        const dataCreate = { namaBarang: 'Barang A', stok: 10, harga: 50000 };
        const response = await request(app)
            .post('/barangs')
            .send(dataCreate);

        Barang.create = createBarang;

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('error', 'Database error occurred');
    });

    test('PUT /barangs/:id - should handle server errors', async () => {
        const editBarang = Barang.findByPk;
        Barang.findByPk = jest.fn(() => {
            throw new Error('Database error occurred');
        });

        const barangId = 1;
        const updatedData = { namaBarang: 'Barang Updated', stok: 15, harga: 60000 };
        const response = await request(app)
            .put(`/barangs/${barangId}`)
            .send(updatedData);

        Barang.findByPk = editBarang;

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('error', 'Database error occurred');
    });

    test('DELETE /barangs/:id - should handle server errors', async () => {
        const deleteBarang = Barang.destroy;
        Barang.destroy = jest.fn(() => {
            throw new Error('Database error occurred');
        });

        const barangId = 1;
        const response = await request(app).delete(`/barangs/${barangId}`);

        Barang.destroy = deleteBarang;

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('error', 'Database error occurred');
    });

    test('GET/barangs - jika error dan retrun 505 dengan error messagenya', async()=>{
        const getAllBarangs = Barang.findAll; 
        Barang.findAll = jest.fn(()=>{
            throw new Error('Database error occured');
        });

        const response = await request(app).get('/barangs');
        
        Barang.findAll = getAllBarangs; 
        expect(response.status).toBe(500); 
        expect(response.body).toHaveProperty('error', 'Database error occured');
    }); 

});