const request = require('supertest');
const app = require('../app');
const { User } = require('../models');
const bcrypt = require('bcryptjs');

describe('User API', () => {
    beforeAll(async () => {
        const hashedPassword1 = await bcrypt.hash('password1', 10); 
        const hashedPassword2 = await bcrypt.hash('password2', 10);

        await User.bulkCreate([
            { id: 1, username: 'User A', password: hashedPassword1},
            { id: 2, username: 'User B', password: hashedPassword2}
        ]);
    });

    afterAll(async () => {
        await User.destroy({ truncate: true, cascade: true }); 
    });

    //GET 
    test('GET /users', async () => {
        const response = await request(app).get('/users');
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2);
    });

    //GET USER BY ID 
    test('GET /users/:id - jika sukses get user by Id', async () => {
        const userId = 1;
        const response = await request(app).get(`/users/${userId}`);

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(1);
        expect(response.body.username).toBe('User A');
        expect(response.body.password).toBeDefined();
    });

    test('GET /users/id - jika pengguna tidak ditemukan', async () => {
        const userId = 300;
        const response = await request(app).get(`/users/${userId}`);
    
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: `User dengan ID ${userId} tidak ditemukan!` });
    });

    //ADD BARANG
    test('POST/users - should add and show new user', async()=>{
        const password3 = await bcrypt.hash('password3', 10)
        const response = await request(app)
            .post('/users')
            .send({ 
                username : 'Username 3', 
                password : password3 
            });
        expect(response.status).toBe(201); 
        expect(response.body).toHaveProperty('id');
        expect(response.body.username).toBe('Username 3');
        expect(response.body.password).toBeDefined();
    });

    test('POST /users - status 400 jika username dan password tidak ada', async () => {
        const response = await request(app)
            .post('/users')
            .send({});
    
        expect(response.status).toBe(400); 
        expect(response.body).toEqual({ message: "username dan password tidak boleh kosong!" });
    });

    //EDIT USER 
    test('PUT/users/:id - jika sukses edit nama dan password', async()=>{
        const userId =1; 
        const password1new = await bcrypt.hash('password1new', 10);

        const updatedUserData = {
            username: 'NewUsername1',
            password: password1new
        };

        const response = await request(app)
            .put(`/users/${userId}`)
            .send({updatedUserData}); 
        expect(response.status).toBe(200); 
        expect(response.body.message).toBe(`Data user dengan ID ${userId} berhasil diperbarui`);
    });

    // test('PUT/users/id -jika sukses aupdate username saja', async()=>{

    // });

    test('Update user with new password only', async () => {
        const userId = 1;
        const newPassword = 'newPassword';

        const response = await request(app)
            .put(`/users/${userId}`)
            .send({ password: newPassword });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe(`Data user dengan ID ${userId} berhasil diperbarui`);
        const updatedUser = await User.findByPk(userId);

        const passwordMatch = await bcrypt.compare(newPassword, updatedUser.password);
        expect(passwordMatch).toBe(true);
    });

    test('PUT /users/:id - jika user tidak ditemukan', async () => {
        const userId = 300;
    
        const response = await request(app)
            .put(`/users/${userId}`)
            .send({ username: 'NewUsername', password: 'newpassword' });
    
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: `user dengan ID ${userId} tidak ditemukan!` });
    });

    //DELETE USER 
    test('DELETE/users/:id - jika sukses edit users', async()=>{
        const userId =1; 
        const response = await request(app).delete(`/users/${userId}`); 

        expect(response.status).toBe(200);
        expect(response.body.message).toBe(`User dengan ID ${userId} berhasil dihapus!`);
    });

    test('DELETE/users/:id - jika user tidak ditemukan', async()=>{
        const userId = 120; 
        const response = await request(app).delete(`/users/${userId}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe(`User dengan ID ${userId} tidak ditemukan!`);
    });


    //CATCH ERROR 
    test('GET/users - jika error dan retrun 505 dengan error messagenya', async()=>{
        const userAll = User.findAll; 
        User.findAll = jest.fn(()=>{
            throw new Error('Database error occured');
        });

        const response = await request(app).get('/users');
        
        User.findAll = userAll; 
        expect(response.status).toBe(500); 
        expect(response.body).toHaveProperty('error', 'Database error occured');
    }); 

    test('GET /users/:id - handle server errors', async () => {
        const findUserById = User.findByPk;
        User.findByPk = jest.fn(() => {
            throw new Error('Database error occurred');
        });

        const userId = 1;
        const response = await request(app).get(`/users/${userId}`);

        User.findByPk = findUserById;

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('error', 'Database error occurred');
    });

    test('ADD/users/ - jika add user with invalid data', async () => {
        const createUser = User.create;
        User.create = jest.fn(() => {
            throw new Error('Database error occurred');
        });
        const password4 = await bcrypt.hash('password4', 10)
        const response = await request(app)
            .post('/users')
            .send({ 
                username: 'User 4',  
                password: password4 
            });
        User.create = createUser;

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('error', 'Database error occurred');
    });

    test('PUT/users/:id - Jika error handle update', async () => {
        const userFindById = User.findByPk;
        User.findByPk = jest.fn(() => {
            throw new Error('Database error occurred');
        });

        const userId = 1;
        const password1new = await bcrypt.hash('password1new', 10);
        const response = await request(app)
            .put(`/users/${userId}`)
            .send({ namaSupplier: 'Supplier A1', password: password1new});

        User.findByPk = userFindById;

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('error', 'Database error occurred');
    });

    test('DELETE /users/:id - should handle server errors', async () => {
        const deleteUser = User.destroy;
        User.destroy = jest.fn(() => {
            throw new Error('Database error occurred');
        });

        const userId = 1;
        const response = await request(app).delete(`/users/${userId}`);

        User.destroy = deleteUser;

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('error', 'Database error occurred');
    });
});

