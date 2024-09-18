/** @format */

import React from "react";
import HomeScreen from "../screens/HomeScreen";
import { Affix, Layout } from "antd";
import SiderComponent from "../components/SiderComponent";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HeaderComponent } from "../components";
import {
  Inventories,
  ManageStore,
  Orders,
  ReportScreen,
  Suppliers,
} from "../screens";
import AddProduct from "../screens/inventories/AddProduct";
import Categories from "../screens/Categories";

const { Content, Footer, Header } = Layout;

const MainRouter = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Affix offsetTop={0}>
          <SiderComponent />
        </Affix>
        <Layout style={{ backgroundColor: "white" }}>
          <Affix offsetTop={0}>
            <HeaderComponent />
          </Affix>
          <Content className="mt-3 mb-2 container-fluid bg-white">
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route>
                <Route path="/inventory" element={<Inventories />} />
                <Route path="/inventory/add-product" element={<AddProduct />} />
              </Route>
              <Route path="/report" element={<ReportScreen />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/manage-store" element={<ManageStore />} />
            </Routes>
          </Content>
          <Footer />
        </Layout>
      </Layout>
    </BrowserRouter>
  );
};

export default MainRouter;
