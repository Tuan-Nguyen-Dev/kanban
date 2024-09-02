import { Avatar, Button, Form, message, Modal, Select, Typography } from "antd";
import Input from "antd/es/input/Input";
import { User } from "iconsax-react";
import React, { useRef, useState } from "react";
import { colors } from "../constants/color";
import { uploadFile } from "../utils/uploadFile";
import { replaceName } from "../utils/replaceName";
import handleAPI from "../apis/handleAPI";
import { SupplierModel } from "../models/SupplierModel";

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
  const [isTaking, setIsTaking] = useState<boolean>();
  const [file, setFile] = useState<any>();

  const [form] = Form.useForm();
  const inpRef = useRef<any>();
  const addNewSupplier = async (values: any) => {
    setIsLoading(true);

    const data: any = {};
    const api = `/supplier/add-new`;

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
      const res: any = await handleAPI(api, data, "post");
      onAddNew(res.data);
      message.success(res.message);
      handleClose();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      closable={!isLoading}
      open={visible}
      onClose={handleClose}
      onCancel={handleClose}
      okButtonProps={{
        loading: isLoading,
      }}
      title="Add Supplier"
      okText="Add Supplier"
      cancelText="Discard"
      onOk={() => form.submit()}
    >
      <label htmlFor="inpFile" className="p-2 mb-3 row">
        {file ? (
          <Avatar size={100} src={URL.createObjectURL(file)} />
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

      <Form
        disabled={isLoading}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        size="large"
        onFinish={addNewSupplier}
        layout="horizontal"
        form={form}
      >
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
        </Form.Item>
      </Form>
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
