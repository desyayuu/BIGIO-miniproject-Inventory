const {addBarang, getAllBarangs, getBarangById, deleteBarang, updateBarang} = require ('../../controllers/barangController');

describe('Barang Controller', () => {
    test ('Add Barang', async()=> {
        const req ={
            body: {namaBarang: 'TestBarang', stok: 10, harga: 5000}
        }
        const res ={
            json: jest.fn(), 
            status: jest.fn().mockReturnThis()
        };

        await addBarang(req, res); 
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalled();
    })

    test ('Get All Barang', async()=> {
        const res ={
            json: jest.fn()
        }

        await getAllBarangs(null, res); 
        expect(res.json).toHaveBeenCalled();
    })

    test ('Edit Barang', async()=> {
        const req ={
            params:{id: 1},
            body: {namaBarang: 'Test Barang 1', stok:'11', harga:'5100'}
        }
        const res ={
            json: jest.fn(), 
            status: jest.fn().mockReturnThis()
        };

        await updateBarang(req, res); 
        expect(res.json).toHaveBeenCalled()
    })

    test ('Get Barang by Id', async()=> {
        const req={
            params: {id: 1}
        }

        const res ={
            json: jest.fn(), 
            status: jest.fn().mockReturnThis()
        }

        await getBarangById(req, res); 
        expect(res.json).toHaveBeenCalled();
    })

    test ('Delete Barang',async()=>{
        const req={
            params: {id: 1}
        }

        const res={
            json: jest.fn(), 
            status: jest.fn().mockReturnThis()
        }

        await deleteBarang(req, res); 
        expect(res.json).toHaveBeenCalled();
    })
})
