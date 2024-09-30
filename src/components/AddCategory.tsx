import React, { useEffect, useState } from "react";
import { TreeModel } from "../models/FormModel";
import { CategoryModel } from "../models/Product";
import { Button, Form, Input, message, Space, TreeSelect } from "antd";
import { replaceName } from "../utils/replaceName";
import handleAPI from "../apis/handleAPI";

interface Props {
  onAddNew: (val: any) => void;
  values: TreeModel[];
  seleted?: CategoryModel;
  onClose?: () => void;
}

const AddCategory = (props: Props) => {
  const { onAddNew, values, seleted, onClose } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (seleted) {
      form.setFieldsValue(seleted);
    } else {
      form.resetFields();
    }
  }, [seleted]);

  const handleCategories = async (values: any) => {
    const api = seleted
      ? `/products/update-category?id=${seleted._id}`
      : `/products/add-category`;

    const data: any = {};

    for (const i in values) {
      data[i] = values[i] ?? "";
    }
    data.slug = replaceName(values.title);

    try {
      setIsLoading(true);

      const res = await handleAPI(api, data, seleted ? "put" : "post");

      message.success("Add new category success");

      onAddNew(res.data);

      form.resetFields();
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
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

      <div className="text-right">
        <Space>
          {onClose && (
            <Button
              loading={isLoading}
              disabled={isLoading}
              onClick={() => {
                form.resetFields();
                onClose();
              }}
            >
              Cancel
            </Button>
          )}

          <Button
            type="primary"
            loading={isLoading}
            disabled={isLoading}
            onClick={() => form.submit()}
          >
            {seleted ? "Update" : "Submit"}
          </Button>
        </Space>
      </div>
    </>
  );
};

export default AddCategory;
