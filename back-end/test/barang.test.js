const request = require('supertest');
// const server = require('../app');
const app = require('../app');
const { getAllBarangs } = require('../controllers/barangController');
const { Barang } = require('../models');

describe('API Barang', () => {
    beforeAll(async () => {
        await Barang.bulkCreate([
            { id: 1, namaBarang: 'Barang A', stok: 10, harga: 50000 },
            { id: 2, namaBarang: 'Barang B', stok: 20, harga: 75000 }
        ]);
    });

    afterAll(async () => {
        await Barang.destroy({ truncate: true, cascade: true }); 
    });

    test('GET /barangs', async () => {
        const response = await request(app).get('/barangs');
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2);
    });

    test('GET /barangs - Handle errors and return status code 500 with error message', async () => {
        jest.spyOn(Barang, 'findAll').mockRejectedValue(new Error('Database error'));
        const response = await request(app).get('/barangs');

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Database error' });
    });

    test('ADD /barangs - should add and show new barang', async()=>{
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

});