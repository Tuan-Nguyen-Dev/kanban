/** @format */

import { Button } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { refreshToken, removeAuth } from "../redux/reducers/authReducer";
import handleAPI from "../apis/handleAPI";
import { useAppSelector } from "../redux/hook";

const HomeScreen = () => {
  const dispatch = useDispatch();
  const auth = useAppSelector((state) => state.authData.data);

  const logout = () => {
    dispatch(removeAuth({}));
  };

  const getProducts = async () => {
    const api = `/storage/products`;

    try {
      const res = await handleAPI(api);
      console.log(res);
    } catch (error: any) {
      console.log(error);
      if (error.error === "jwt expired") {
        handleRefreshToken();
      }
    }
  };

  const handleRefreshToken = async () => {
    const api = `/auth/refresh-token?id=${auth._id}`;

    try {
      const res = await handleAPI(api);
      dispatch(refreshToken(res.data.token));
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Button onClick={getProducts}>Logout</Button>
    </div>
  );
};

export default HomeScreen;
