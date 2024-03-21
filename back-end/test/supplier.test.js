const request = require('supertest');
const app = require('../app');
const { Supplier } = require('../models');

describe('API Supplier', () => {
    beforeAll(async () => {
        await Supplier.bulkCreate([
            { idSupplier: 1, namaSupplier: 'Supplier A', alamat:"surabaya", noHp:6282333133322 },
            { idSupplier: 2, namaSupplier: 'Supplier B', alamat:"malang", noHp:6282333133321 }
        ]);
    });

    afterAll(async () => {
        await Supplier.destroy({ truncate: true, cascade: true }); 
    });

    test('GET /suppliers - jika sukses get suppliers',async () => {
        const response = await request(app).get('/suppliers');
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2);
    });

    test('GET/suppliers/:id - jika sukss get suppliers by Id', async()=>{
        const supplierId=1;
        const response = await request(app).get(`/suppliers/${supplierId}`); 

        expect(response.status).toBe(200); 
        expect(response.body.idSupplier).toBe(1); 
        expect(response.body.namaSupplier).toBe('Supplier A'); 
        expect(response.body.alamat).toBe('surabaya'); 
        expect(Number(response.body.noHp)).toBe(6282333133322);

    });

    test('GET/suppliers/:id - jika id not found', async()=>{
        const supplierId = 999;
        const response = await request(app).get(`/suppliers/${supplierId}`);

        expect(response.status).toBe(404);
        expect(response.body.error).toBe(`Supplier dengan ID ${supplierId} tidak ditemukan!`);

    })

    test('ADD /suppliers - jika sukses add suppliers', async()=>{
        const response = await request(app)
            .post('/suppliers')
            .send({ 
                namaSupplier:"Supplier C", 
                alamat: 'malang', 
                noHp: 6282333133323
            });
        expect(response.status).toBe(201); 
        expect(response.body).toHaveProperty('idSupplier');
        expect(response.body.namaSupplier).toBe('Supplier C');
        expect(response.body.alamat).toBe('malang');
        expect(Number(response.body.noHp)).toBe(6282333133323);
    });

    test('ADD /suppliers - jika tidak add nama for required fieldnya ', async () => {
        const response = await request(app)
            .post('/suppliers')
            .send({alamat: 'jakarta'});

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Nama supplier tidak boleh kosong!');
    });

    test('ADD/suppplier - jika id supplier tidak ada', async()=>{
        const nonExistId= 333; 
        const response = await request(app)
                .put(`/suppliers/${nonExistId}`)
                .send({
                    namaSupplier: 'Supplier E',
                    alamat: 'Alamat E', 
                    noHp: 6282333133326
                }); 
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', `Supplier dengan ID ${nonExistId} tidak ditemukan!`);        
    }); 

    test('PUT/suppliers/:id - jika sukses edit suppliers', async()=>{
        const supplierId =1; 
        const response = await request(app)
            .put(`/suppliers/${supplierId}`)
            .send({
                namaSupplier:"Supplier A", 
                alamat: 'malang 1', 
                noHp: 6282333133322
            }); 
        expect(response.status).toBe(200); 
        expect(response.body.namaSupplier).toBe('Supplier A');
        expect(response.body.alamat).toBe('malang 1'); 
        expect(Number(response.body.noHp)).toBe(6282333133322);
    });

    test('DELETE/suppliers/:id - jika sukses edit suppliers', async()=>{
        const supplierId =1; 
        const response = await request(app).delete(`/suppliers/${supplierId}`); 

        expect(response.status).toBe(200);
        expect(response.body.message).toBe(`Supplier dengan ID ${supplierId} berhasil dihapus!`);
    });

    test('DELETE/suppliers/:id - Jika id tidak ditemukan', async () => {
        const response = await request(app).delete('/suppliers/999');

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Supplier dengan ID 999 tidak ditemukan!');
    });

    //CATCH ERROR
    test('GET/suppliers - jika error dan retrun 505 dengan error messagenya', async()=>{
        const allSuppliers = Supplier.findAll; 
        Supplier.findAll = jest.fn(()=>{
            throw new Error('Database error occured');
        });

        const response = await request(app).get('/suppliers');
        
        Supplier.findAll = allSuppliers; 
        expect(response.status).toBe(500); 
        expect(response.body).toHaveProperty('error', 'Database error occured');
    }); 

    test('GET/supplier/:id - Jika error dan return 505 dengan error message', async()=>{
        const getSupplierId = Supplier.findOne; 
        Supplier.findOne = jest.fn(()=>{
            throw new Error('Database error occured');
        }); 

        const idSupplier = 1; 
        const response = await request(app).get(`/suppliers/${idSupplier}`);
        Supplier.findOne = getSupplierId

        expect(response.status).toBe(500); 
        expect(response.body).toHaveProperty('error', 'Database error occured'); 
    })

    test('ADD/suppliers/:id - jika add supplier with invalid data', async () => {
        const createSupplier = Supplier.create;
        Supplier.create = jest.fn(() => {
            throw new Error('Database error occurred');
        });

        const response = await request(app)
            .post('/suppliers')
            .send({ namaSupplier: 'Supplier D', alamat: 'Malang', noHp:6282333133325 });

        
        Supplier.create = createSupplier;
        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('error', 'Database error occurred');
    });

    test('PUT/suppliers/:id - Jika error handle update', async () => {
        const supFindId = Supplier.findByPk;
        Supplier.findByPk = jest.fn(() => {
            throw new Error('Database error occurred');
        });

        const response = await request(app)
            .put('/suppliers/1')
            .send({ namaSupplier: 'Supplier D', alamat: 'Malang', noHp: '628123456789' });

        Supplier.findByPk = supFindId;

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('error', 'Database error occurred');
    });

    test('DELETE/id - Jika error', async () => {
        const deleteSupplier = Supplier.destroy;
        Supplier.destroy = jest.fn(() => {
            throw new Error('Database error occurred');
        });

        const response = await request(app).delete('/suppliers/1');

        Supplier.destroy = deleteSupplier;
        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('error', 'Database error occurred');
    });
});