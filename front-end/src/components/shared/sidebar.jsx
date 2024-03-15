import React from "react";
import { Outlet } from 'react-router-dom'
import { Sidebar } from 'flowbite-react';
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser, HiViewBoards } from 'react-icons/hi';
import Header from "./header";

export default function Layout(){
    return(
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />
      <div style={{ display: 'flex', flex: 1 }}>
      <Sidebar aria-label="Default sidebar example">
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <Sidebar.Item href="/" icon={HiChartPie}>
              Dashboard
            </Sidebar.Item>
            <Sidebar.Item href="/barang" icon={HiShoppingBag}>
              Barang
            </Sidebar.Item>
            <Sidebar.Item href="/supplier" icon={HiShoppingBag}>
              Supplier
            </Sidebar.Item>
            <Sidebar.Item href="/kelolaStok" icon={HiInbox}>
              Kelola Stok
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    {<Outlet/>}
    </div>
    </div>
    )
}