/* eslint-disable react/jsx-no-undef */
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/shared/sidebar";
import Dashboard from "./components/Dashboard";
import Barang from "./components/Barang";
import Supplier from "./components/Supplier";
import KelolaStok from "./components/KelolaStok";


function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route index element={<Dashboard />} />
        <Route path="barang" element={<Barang />} />
        <Route path="supplier" element={<Supplier />} />
        <Route path="kelolaStok" element={<KelolaStok />} />
      </Route>
    </Routes>
    </Router>
  );
}

export default App;
