import { Form, Input, Modal } from "antd";
import { useForm } from "antd/es/form/Form";
import { useState } from "react";

interface Props {
  visible: boolean;
  onClose: () => void;
}

interface ProductModel {
  title: string;
  description: string;
  supplier: string;
  categories: string[];
}

const ModalAddProduct = (props: Props) => {
  const { visible, onClose } = props;

  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    onClose();
  };

  const handleAddProduct = (values: ProductModel) => {};

  return (
    <Modal
      title="Product"
      open={visible}
      onCancel={handleClose}
      onClose={handleClose}
    >
      <Form
        form={form}
        disabled={false}
        layout="vertical"
        size="large"
        onFinish={handleAddProduct}
      >
        <Form.Item
          name={"title"}
          label="Title"
          rules={[
            {
              required: true,
              message: "Please enter title product",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name={"description"} label="Description">
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalAddProduct;
