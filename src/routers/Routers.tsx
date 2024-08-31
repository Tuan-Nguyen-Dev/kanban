/** @format */

import React, { useEffect, useState } from "react";
import AuthRouter from "./AuthRouter";
import MainRouter from "./MainRouter";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import { addAuth, AuthState } from "../redux/reducers/authReducer";
import { localDataName } from "../constants/appInfo";
import { Spin } from "antd";

const Routers = () => {
  // check login
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const auth = useAppSelector((state) => state.authData.data);
  const disptach = useAppDispatch();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const res = localStorage.getItem(localDataName.authData);
    res && disptach(addAuth(JSON.parse(res)));
  };

  const handleCheckToken = async () => {};

  return isLoading ? <Spin /> : !auth.token ? <AuthRouter /> : <MainRouter />;
};

export default Routers;
