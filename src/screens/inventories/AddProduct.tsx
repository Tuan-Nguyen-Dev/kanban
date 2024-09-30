import { Editor } from "@tinymce/tinymce-react";
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  message,
  Select,
  Space,
  Spin,
  TreeSelect,
  Typography,
  Image,
  UploadProps,
  Upload,
} from "antd";
import { useEffect, useRef, useState } from "react";
import handleAPI from "../../apis/handleAPI";
import { ModalCategory } from "../../modals";
import { SelectModel, TreeModel } from "../../models/FormModel";
import { getTreeValues } from "../../utils/getTreeValues";
import { replaceName } from "../../utils/replaceName";
import { uploadFile } from "../../utils/uploadFile";
import { useSearchParams } from "react-router-dom";
import { url } from "inspector";

const { Text, Paragraph, Title } = Typography;

const AddProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");
  const [supplierOption, setSetsupplierOption] = useState<SelectModel[]>([]);
  const [fileUrl, setFileUrl] = useState("");
  const [isVisableAddCategory, setIsVisableAddCategory] = useState(false);
  const [categories, setCategories] = useState<TreeModel[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);

  const [searchParam] = useSearchParams();
  const id = searchParam.get("id");

  const editorRef = useRef<any>(null);

  const [form] = Form.useForm();

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (id) {
      getProductDetail(id);
    }
  }, [id]);

  const getProductDetail = async (id: string) => {
    const api = `/products/detail?id=${id}`;
    try {
      const res = await handleAPI(api);
      const item = res.data;

      if (item) {
        console.log(item);
        form.setFieldsValue(item);
        setContent(item.content);
        if (item.images && item.images.length > 0) {
          const items = [...fileList];
          item.images.forEach((url: string) =>
            items.push({
              uid: `${Math.floor(Math.random() * 1000000)}`,
              name: url,
              status: "done",
              url,
            })
          );
          setFileList(items);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddNewProduct = async (values: any) => {
    const content = editorRef.current.getContent();

    const data: any = {};
    setIsCreating(true);

    for (const i in values) {
      data[`${i}`] = values[`${i}`] ?? "";
    }
    data.content = content;
    data.slug = replaceName(values.title);

    if (fileList.length > 0) {
      const urls: string[] = [];

      fileList.forEach(async (file) => {
        if (file.originFileObj) {
          const url = await uploadFile(file.originFileObj);
          url && urls.push(url);
        } else {
          urls.push(file.url);
        }
      });
      data.images = urls;
    }

    try {
      await handleAPI(
        `/products/${id ? `update?id=${id}` : `add-new`}`,
        data,
        id ? "put" : "post"
      );

      window.history.back();
    } catch (error) {
      console.log(error);
    } finally {
      setIsCreating(false);
    }
  };

  const getData = async () => {
    setIsLoading(true);
    try {
      await getSupplier();
      await getCategories();
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getSupplier = async () => {
    const api = `/supplier`;
    const res = await handleAPI(api);

    const data = res.data.items;

    const option = data.map((item: any) => ({
      value: item._id,
      label: item.name,
    }));

    setSetsupplierOption(option);
  };

  const getCategories = async () => {
    const api = `/products/get-categories`;

    const res = await handleAPI(api);
    const datas = res.data;
    const data = datas.length > 0 ? getTreeValues(datas, true) : [];

    setCategories(data);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    const items = newFileList.map((item) =>
      item.originFileObj
        ? {
            ...item,
            url: item.originFileObj
              ? URL.createObjectURL(item.originFileObj)
              : "",
            status: "done",
          }
        : { ...item }
    );
    setFileList(items);
  };

  return isLoading ? (
    <Spin
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    />
  ) : (
    <div>
      <div className="container">
        <Title level={3}>{id ? "Detail Product" : "Add New Product"}</Title>
        <Form
          disabled={isCreating}
          form={form}
          onFinish={handleAddNewProduct}
          layout="vertical"
        >
          <div className="row">
            <div className="col-8">
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
                <Input allowClear maxLength={150} showCount />
              </Form.Item>

              <Form.Item
                name={"description"}
                label="Description"
                // rules={[
                //   {
                //     required: true,
                //     message: "Please enter description product",
                //   },
                // ]}
              >
                <Input.TextArea
                  rows={4}
                  maxLength={1000}
                  allowClear
                  showCount
                />
              </Form.Item>
              <Editor
                disabled={isLoading || isCreating}
                apiKey="ikfkh2oosyq8z4b77hhj1ssxu7js46chtdrcq9j5lqum494c"
                onInit={(evt, editor) => (editorRef.current = editor)}
                initialValue={content !== "" ? content : ""}
                init={{
                  height: 500,
                  menubar: true,
                  plugins: [
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "image",
                    "charmap",
                    "preview",
                    "anchor",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "insertdatetime",
                    "media",
                    "table",
                    "code",
                    "help",
                    "wordcount",
                  ],
                  toolbar:
                    "undo redo | blocks | " +
                    "bold italic forecolor | alignleft aligncenter " +
                    "alignright alignjustify | bullist numlist outdent indent | " +
                    "removeformat | help",
                  content_style:
                    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                }}
              />
            </div>
            <div className="col-4">
              <Card className="mt-4">
                <Space>
                  <Button
                    loading={isCreating}
                    size="middle"
                    onClick={() => form.submit()}
                  >
                    Cancel
                  </Button>
                  <Button
                    loading={isCreating}
                    size="middle"
                    type="primary"
                    onClick={() => form.submit()}
                  >
                    {id ? "Update" : "Submit"}
                  </Button>
                </Space>
              </Card>
              <Card size="small" className="mt-4" title="Categories">
                <Form.Item name={"categories"}>
                  <TreeSelect
                    allowClear
                    treeData={categories}
                    multiple
                    dropdownRender={(menu) => (
                      <>
                        {menu}

                        <Divider />

                        <Button
                          type="link"
                          onClick={() => setIsVisableAddCategory(true)}
                        >
                          Add new
                        </Button>
                      </>
                    )}
                  />
                </Form.Item>
              </Card>
              <Card size="small" className="mt-4" title="Suppliers">
                <Form.Item
                  name={"supplier"}
                  rules={[
                    {
                      required: true,
                      message: "Required",
                    },
                  ]}
                >
                  <Select
                    filterOption={(input, option) =>
                      replaceName(option?.label ? option.label : "").includes(
                        replaceName(input)
                      )
                    }
                    showSearch
                    options={supplierOption}
                  />
                </Form.Item>
              </Card>

              <Card size="small" className="mt-3" title="Images">
                <Upload
                  multiple
                  fileList={fileList}
                  accept="image/*"
                  listType="picture-card"
                  onChange={handleChange}
                >
                  Upload
                </Upload>
              </Card>

              <Card className="mt-3">
                <Input
                  allowClear
                  value={fileUrl}
                  onChange={(val) => setFileUrl(val.target.value)}
                />
                <Input
                  accept="image/*"
                  type="file"
                  onChange={async (files: any) => {
                    const file = files.target.files[0];

                    if (file) {
                      const downloadUrl = await uploadFile(file);
                      downloadUrl && setFileUrl(downloadUrl);
                    }
                  }}
                />
              </Card>
            </div>
          </div>
        </Form>
      </div>

      <ModalCategory
        visible={isVisableAddCategory}
        onClose={() => setIsVisableAddCategory(false)}
        onAddNew={async (val) => await getCategories()}
        values={categories}
      />
    </div>
  );
};

export default AddProduct;
