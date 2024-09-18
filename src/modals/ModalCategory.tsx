import { Form, Input, message, Modal, TreeSelect } from "antd";
import React, { useState } from "react";
import { replaceName } from "../utils/replaceName";
import handleAPI from "../apis/handleAPI";
import { SelectModel, TreeModel } from "../models/FormModel";

interface Props {
  visible: boolean;
  onClose: () => void;
  onAddNew: (val: any) => void;
  values: TreeModel[];
}

const ModalCategory = (props: Props) => {
  const { visible, onClose, onAddNew, values } = props;
  const [isLoading, setIsLoading] = useState(false);

  const [form] = Form.useForm();

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  const handleCategories = async (values: any) => {
    const api = `/products/add-category`;
    setIsLoading(true);

    const data: any = {};

    for (const i in values) {
      data[i] = values[i] ?? "";
    }
    data.slug = replaceName(values.title);

    try {
      setIsLoading(true);

      const res = await handleAPI(api, data, "post");

      message.success("Add new category success");
      onAddNew(res.data);

      handleClose();
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      closable={!isLoading}
      open={visible}
      onCancel={handleClose}
      onClose={handleClose}
      onOk={() => {
        form.submit();
      }}
      okButtonProps={{
        loading: isLoading,
        disabled: isLoading,
      }}
      cancelButtonProps={{
        loading: isLoading,
        disabled: isLoading,
      }}
    >
      <Form
        disabled={isLoading}
        form={form}
        layout="vertical"
        onFinish={handleCategories}
        size="large"
      >
        <Form.Item name={"parentId"} label="Parent Category">
          <TreeSelect
            treeData={values}
            allowClear
            showSearch
            placeholder="Please select"
            treeDefaultExpandAll
          />
        </Form.Item>
        <Form.Item
          name={"title"}
          label="Title"
          rules={[
            {
              required: true,
              message: "Please enter category title",
            },
          ]}
        >
          <Input allowClear />
        </Form.Item>
        <Form.Item name={"description"} label="Description">
          <Input.TextArea rows={4} allowClear />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalCategory;
