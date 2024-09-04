import { Avatar, Button, Form, message, Modal, Select, Typography } from "antd";
import Input from "antd/es/input/Input";
import { User } from "iconsax-react";
import React, { useEffect, useRef, useState } from "react";
import { colors } from "../constants/color";
import { uploadFile } from "../utils/uploadFile";
import { replaceName } from "../utils/replaceName";
import handleAPI from "../apis/handleAPI";
import { SupplierModel } from "../models/SupplierModel";
import { FormModel } from "../models/FormModel";

const { Paragraph } = Typography;
interface Props {
  visible: boolean;
  onClose: () => void;
  onAddNew: (val: SupplierModel) => void;
  supplier?: SupplierModel;
}

const ToogleSupplier = (props: Props) => {
  const { visible, onAddNew, onClose, supplier } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [isGetting, setIsGetting] = useState(false);
  const [isTaking, setIsTaking] = useState<boolean>();
  const [formData, setFormData] = useState<FormModel>();
  const [file, setFile] = useState<any>();

  const [form] = Form.useForm();
  const inpRef = useRef<any>();

  useEffect(() => {
    getFormData();
  }, []);

  useEffect(() => {
    if (supplier) {
      form.setFieldsValue(supplier);
      setIsTaking(supplier.isTaking === 1);
    }
  }, [supplier]);

  const addNewSupplier = async (values: any) => {
    setIsLoading(true);

    const data: any = {};
    const api = `/supplier/${
      supplier ? `update?id=${supplier._id}` : "add-new"
    } `;

    for (const i in values) {
      data[i] = values[i] ?? "";
    }

    data.price = values.price ? parseInt(values.price) : 0;

    data.isTaking = isTaking ? 1 : 0;

    if (file) {
      data.photoUrl = await uploadFile(file);
    }

    data.slug = replaceName(values.name);

    try {
      const res: any = await handleAPI(api, data, supplier ? "put" : "post");
      !supplier && onAddNew(res.data);
      message.success(res.message);
      handleClose();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFormData = async () => {
    const api = `/supplier/get-form`;
    setIsGetting(true);
    try {
      const res = await handleAPI(api);
      res.data && setFormData(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsGetting(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    setFile(undefined);
    onClose();
  };

  return (
    <Modal
      loading={isGetting}
      closable={!isLoading}
      open={visible}
      onClose={handleClose}
      onCancel={handleClose}
      okButtonProps={{
        loading: isLoading,
      }}
      title={supplier ? "Update" : "Add Supplier"}
      okText={supplier ? "Update" : "Add Supplier"}
      cancelText="Discard"
      onOk={() => form.submit()}
    >
      <label htmlFor="inpFile" className="p-2 mb-3 row">
        {file ? (
          <Avatar size={100} src={URL.createObjectURL(file)} />
        ) : supplier ? (
          <Avatar size={100} src={supplier.photoUrl} />
        ) : (
          <Avatar
            style={{
              backgroundColor: "white",
              border: "1px dashed #e0e0e0",
            }}
            size={100}
          >
            <User size={80} color={colors.gray600} />
          </Avatar>
        )}

        <div className="ml-3">
          <Paragraph className="text-muted m-0">Drag image here</Paragraph>
          <Paragraph className="text-muted mb-2">Or</Paragraph>
          <Button onClick={() => inpRef.current.click()} type="link">
            Browse image
          </Button>
        </div>
      </label>

      {formData && (
        <Form
          disabled={isLoading}
          labelCol={{ span: formData.labelCol }}
          wrapperCol={{ span: formData.wrapperCol }}
          size="large"
          onFinish={addNewSupplier}
          layout={formData.layout ?? "horizontal"}
          form={form}
        >
          {formData.formItems.map((item) => (
            <Form.Item
              key={item.key}
              name={item.value}
              label={item.label}
              rules={[
                {
                  required: item.required,
                  message: item.message,
                },
              ]}
            >
              <Input placeholder={item.placeholder} allowClear />
            </Form.Item>
          ))}

          {/* 
          <Form.Item
            name={"name"}
            label="Supplier name"
            rules={[
              {
                required: true,
                message: "Enter supplier name",
              },
            ]}
          >
            <Input placeholder="Enter supplier name" allowClear />
          </Form.Item>
          <Form.Item name={"product"} label="Product name">
            <Input placeholder="Enter Product name" allowClear />
          </Form.Item>

          <Form.Item name={"email"} label="Email name">
            <Input placeholder="Enter email name" allowClear type="email" />
          </Form.Item>

          <Form.Item name={"active"} label="Active name">
            <Input placeholder="" allowClear type="number" />
          </Form.Item>

          <Form.Item name={"categories"} label="Category name">
            <Select options={[]} placeholder="Select product category" />
          </Form.Item>
          <Form.Item name={"price"} label="Buying Price">
            <Input
              placeholder="Enter buying price name"
              allowClear
              type="number"
            />
          </Form.Item>

          <Form.Item name={"contact"} label="Contact number">
            <Input
              placeholder="Enter supplier contact number"
              allowClear
              type="number"
            />
          </Form.Item>
          <Form.Item label="Type">
            <div className="mb-2">
              <Button
                onClick={() => setIsTaking(false)}
                type={isTaking === false ? "primary" : "default"}
              >
                Not taking return
              </Button>
            </div>
            <Button
              onClick={() => setIsTaking(true)}
              type={isTaking ? "primary" : "default"}
            >
              Taking return
            </Button>
          </Form.Item> */}
        </Form>
      )}

      <div className="d-none">
        <input
          type="file"
          accept="image/*"
          name=""
          ref={inpRef}
          id="inpFile"
          onChange={(val: any) => setFile(val.target.files[0])}
        />
      </div>
    </Modal>
  );
};

export default ToogleSupplier;
