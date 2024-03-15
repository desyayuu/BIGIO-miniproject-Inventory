import React, { useState, useEffect } from 'react';
import { Banner, FloatingLabel, Button, Datepicker, Select } from 'flowbite-react';

export default function KelolaStok() {
  const [selectedBarang, setSelectedBarang] = useState('');
  const [selectedBarangName, setSelectedBarangName] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [selectedSupplierName, setSelectedSupplierName] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [jenisBarang, setJenisBarang] = useState('');
  const [jumlahBarang, setJumlahBarang] = useState('');
  const [barangs, setBarangs] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    fetchBarangs();
    fetchSuppliers();
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

  const fetchSuppliers = async () => {
    try {
      const response = await fetch ('http://localhost:4000/suppliers');
      if(response.ok){
        const data = await response.json();
        setSuppliers(data);
      }
    } catch (error) {
      
    }
  }

  const handleBarangChange = (e) => {
    const selectedId = e.target.value;
    setSelectedBarang(selectedId);
    const selectedBarang = barangs.find(barang => barang.idBarang === selectedId);
    setSelectedBarangName(selectedBarang ? selectedBarang.namaBarang : '');
  };

  const handleNamaBarangChange = (e) => {
    const selectedName = e.target.value;
    setSelectedBarangName(selectedName);
    const selectedBarang = barangs.find(barang => barang.namaBarang === selectedName);
    setSelectedBarang(selectedBarang ? selectedBarang.idBarang : '');
  };

  const handleSupplierChange = (e) => {
    const selectedId = e.target.value; 
    setSelectedSupplier(selectedId); 
    const selectedSupplier = suppliers.find(supplier => supplier.idSupplier === selectedId); 
    setSelectedSupplierName(selectedSupplier ? selectedSupplier.idSupplier: '');
  }

  const handleNamaSupplierChange = (e) => {
    const selectedName = e.target.value;
    setSelectedSupplierName(selectedName);
    const selectedSupplier = suppliers.find(supplier => supplier.namaSupplier === selectedName);
    setSelectedSupplier(selectedSupplier? selectedSupplier.idSupplier : '');
  };

  const handleJenisBarangChange = (e) => {
    setJenisBarang(e.target.value);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleJumlahBarangChange = (e) => {
    setJumlahBarang(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      if (!selectedBarang || !selectedBarangName || !selectedSupplier || !selectedSupplierName |!jenisBarang || !jumlahBarang || !selectedDate) {
        console.error('Harap lengkapi semua data yang diperlukan!');
        return;
      }
  
      const newTransaction = {
        idBarang: selectedBarang,
        namaBarang: selectedBarangName,
        idSupplier: selectedSupplier, 
        namaSupplier: selectedSupplier, 
        jenis: jenisBarang,
        jumlah: jumlahBarang,
        createdAt: selectedDate 
      };
  
      const response = await fetch('http://localhost:4000/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTransaction)
      });
  
      if (response.ok) {
        setSelectedBarang('');
        setSelectedBarangName('');
        setSelectedSupplier('');
        setSelectedSupplierName('');
        setSelectedDate(new Date());
        setJenisBarang('');
        setJumlahBarang('');
  
        console.log('Transaksi berhasil disimpan!');
      } else {
        console.error('Gagal menyimpan transaksi:', response.statusText);
      }
    } catch (error) {
      console.error('Error saat menyimpan transaksi:', error);
    }
  };
  
  return (
    <Banner>
      <div className="px-10 flex w-full flex-col justify-between p-4 dark:border-gray-600 dark:bg-gray-700 md:flex-row">
        <h2 className="mb-1 text-base font-semibold text-gray-900 dark:text-white">Kelola Stok Barang</h2>
      </div>
      <div className="px-10 grid grid-flow-col justify-stretch space-x-4">
        <Select value={selectedSupplier} onChange={handleSupplierChange} style={{ width: '220px', height: '48px' }}>
          <option value="">Pilih ID Supplier</option>
          {suppliers.map((supplier) => (
            <option key={supplier.idSupplier} value={supplier.idSupplier}>{supplier.idSupplier}</option>
          ))}
        </Select>
        <Select value={selectedSupplierName} onChange={handleNamaSupplierChange} style={{ width: '220px', height: '48px' }}>
          <option value="">Pilih Supplier</option>
          {suppliers.map((supplier) => (
            <option key={supplier.idSupplier} value={supplier.namaSupplier}>{supplier.namaSupplier}</option>
          ))}
        </Select>
      </div>
      <div className="px-10 grid grid-flow-col justify-stretch space-x-4 mt-4">
        <Select value={selectedBarang} onChange={handleBarangChange} style={{ width: '220px', height: '48px' }}>
          <option value="">Pilih ID Barang</option>
          {barangs.map((barang) => (
            <option key={barang.idBarang} value={barang.idBarang}>{barang.idBarang}</option>
          ))}
        </Select>
        <Select value={selectedBarangName} onChange={handleNamaBarangChange} style={{ width: '220px', height: '48px' }}>
          <option value="">Pilih Barang</option>
          {barangs.map((barang) => (
            <option key={barang.idBarang} value={barang.namaBarang}>{barang.namaBarang}</option>
          ))}
        </Select>
      </div>
      <div className="px-10 grid grid-flow-col justify-stretch space-x-4 mt-4">
        <Datepicker value={selectedDate} onChange={handleDateChange} style={{ width: '220px', height: '48px' }} />
        <Select value={jenisBarang} onChange={handleJenisBarangChange} style={{ width: '220px', height: '48px' }}>
          <option value="">Pilih Jenis Barang</option>
          <option value="in">in</option>
          <option value="out">out</option>
        </Select>
      </div>
      <div className="px-10 mt-4">
        <FloatingLabel variant="outlined" label="Jumlah Barang" value={jumlahBarang} onChange={handleJumlahBarangChange} style={{ width: '220px', height: '48px' }} />
      </div>
      <div className="px-10 mt-4">
        <Button color="success" onClick={handleSubmit}>Submit</Button>
      </div>
    </Banner>
  );
}
