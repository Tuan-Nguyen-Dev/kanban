/** @format */

import {
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  message,
  Space,
  Typography,
} from "antd";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import SocialLogin from "./components/SocialLogin";
import handleAPI from "../../apis/handleAPI";
import { useAppDispatch } from "../../redux/hook";
import { addAuth } from "../../redux/reducers/authReducer";
import { localDataName } from "../../constants/appInfo";

const { Title, Text, Paragraph } = Typography;
const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRemember, setIsRemember] = useState(false);

  const [form] = Form.useForm();

  const dispatch = useAppDispatch();

  const handleLogin = async (values: { email: string; password: string }) => {
    console.log(values);
    const api = `/auth/resgister`;
    setIsLoading(true);

    try {
      const res: any = await handleAPI(api, values, "post");
      if (res.data) {
        localStorage.setItem(localDataName.authData, JSON.stringify(res.data));
        dispatch(addAuth(res.data));
      }
    } catch (error: any) {
      console.log(error);
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card
        style={{
          width: "50%",
        }}
      >
        <div className="text-center">
          <Title level={2}>Log in to your account</Title>
          <Paragraph type="secondary">
            Welcome back! please enter your details
          </Paragraph>
        </div>

        <Form
          layout="vertical"
          form={form}
          onFinish={handleLogin}
          disabled={isLoading}
          size="large"
        >
          <Form.Item
            name={"name"}
            label="Name"
            rules={[
              {
                required: true,
                message: "Please enter your email!!!",
              },
            ]}
          >
            <Input allowClear />
          </Form.Item>
          <Form.Item
            name={"email"}
            label="Email"
            rules={[
              {
                required: true,
                message: "Please enter your email!!!",
              },
            ]}
          >
            <Input allowClear maxLength={100} type="email" />
          </Form.Item>
          <Form.Item
            name={"password"}
            label="Password"
            rules={[
              {
                required: true,
                message: "Please enter your password!!!",
              },
              () => ({
                validator: (_, value) => {
                  if (value.length < 6) {
                    return Promise.reject(
                      new Error("Mật khẩu phải chứa ít nhất 6 ký tự")
                    );
                  } else {
                    return Promise.resolve();
                  }
                },
              }),
            ]}
          >
            <Input.Password maxLength={100} type="password" />
          </Form.Item>
        </Form>

        <div className="mt-4 mb-3">
          <Button
            loading={isLoading}
            onClick={() => form.submit()}
            type="primary"
            style={{
              width: "100%",
            }}
            size="large"
          >
            Sign Up
          </Button>
        </div>
        <SocialLogin />
        <div className="mt-3 text-center">
          <Space>
            <Text>Already an acount? </Text>
            <Link to={"/login"}>Login</Link>
          </Space>
        </div>
      </Card>
    </>
  );
};

export default SignUp;
