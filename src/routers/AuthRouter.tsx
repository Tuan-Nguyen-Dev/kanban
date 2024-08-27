/** @format */

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login, SignUp } from "../screens";
import { Typography } from "antd";

const { Title } = Typography;

const AuthRouter = () => {
  return (
    <div className="container-fluid">
      <div className="row ">
        <div
          className="col d-none d-lg-block text-center"
          style={{
            marginTop: "15%",
          }}
        >
          <div className="mb-4">
            <img
              src={
                "https://firebasestorage.googleapis.com/v0/b/quanlykho-f881b.appspot.com/o/kaban_logo.png?alt=media&token=82696119-d154-4622-8108-c5ccb8cdec9d"
              }
              alt="logo"
              style={{
                width: 256,
                objectFit: "cover",
              }}
            />
            <div>
              <Title>KANBAN</Title>
            </div>
          </div>
        </div>

        <div className="col content-center">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/sign-up" element={<SignUp />} />
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </div>
  );
};

export default AuthRouter;
