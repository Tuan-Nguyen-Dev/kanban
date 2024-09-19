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
  Typography,
} from "antd";
import { useEffect, useRef, useState } from "react";
import handleAPI from "../../apis/handleAPI";
import { ModalCategory } from "../../modals";
import { SelectModel, TreeModel } from "../../models/FormModel";
import { getTreeValues } from "../../utils/getTreeValues";
import { replaceName } from "../../utils/replaceName";
import { uploadFile } from "../../utils/uploadFile";

const initContent = {
  title: "",
  description: "",
  supplier: "",
};

const { Text, Paragraph, Title } = Typography;

const AddProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");
  const editorRef = useRef<any>(null);
  const [supplierOption, setSetsupplierOption] = useState<SelectModel[]>([]);
  const [fileUrl, setFileUrl] = useState("");
  const [isVisableAddCategory, setIsVisableAddCategory] = useState(false);
  const [categories, setCategories] = useState<TreeModel[]>([]);

  const [form] = Form.useForm();

  useEffect(() => {
    getData();
  }, []);

  const handleAddNewProduct = async () => {
    const content = editorRef.current.getContent();

    console.log(content);
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
    const data = datas.length > 0 ? getTreeValues(datas, "parentId") : [];

    setCategories(data);
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
        <Title level={3}>Add New Product</Title>
        <Form form={form} onFinish={handleAddNewProduct} layout="vertical">
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
                rules={[
                  {
                    required: true,
                    message: "Please enter description product",
                  },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  maxLength={1000}
                  allowClear
                  showCount
                />
              </Form.Item>

              <Editor
                disabled={isLoading}
                onInit={(evt, editor) => (editorRef.current = editor)}
                apiKey="f45yyv668h83hndco8yf9bde22ty6npb6kwk68y5p43k2ryh"
                initialValue={content !== "" ? content : ""}
                init={{
                  height: 500,
                  menubar: true,
                  plugins: [
                    // Core editing features
                    "anchor",
                    "autolink",
                    "charmap",
                    "codesample",
                    "emoticons",
                    "image",
                    "link",
                    "lists",
                    "media",
                    "searchreplace",
                    "table",
                    "visualblocks",
                    "wordcount",
                    // Your account includes a free trial of TinyMCE premium features
                    // Try the most popular premium features until Sep 26, 2024:
                    "checklist",
                    "mediaembed",
                    "casechange",
                    "export",
                    "formatpainter",
                    "pageembed",
                    "a11ychecker",
                    "tinymcespellchecker",
                    "permanentpen",
                    "powerpaste",
                    "advtable",
                    "advcode",
                    "editimage",
                    "advtemplate",
                    "ai",
                    "mentions",
                    "tinycomments",
                    "tableofcontents",
                    "footnotes",
                    "mergetags",
                    "autocorrect",
                    "typography",
                    "inlinecss",
                    "markdown",
                  ],
                  toolbar:
                    "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
                  tinycomments_mode: "embedded",
                  tinycomments_author: "Author name",
                  mergetags_list: [
                    { value: "First.Name", title: "First Name" },
                    { value: "Email", title: "Email" },
                  ],
                }}
              />
            </div>
            <div className="col-4">
              <Card className="mt-4">
                <Space>
                  <Button size="middle" onClick={() => form.submit()}>
                    Cancel
                  </Button>
                  <Button
                    size="middle"
                    type="primary"
                    onClick={() => form.submit()}
                  >
                    Submit
                  </Button>
                </Space>
              </Card>
              <Card size="small" className="mt-4" title="Categories">
                <Form.Item name={"categories"}>
                  <Select
                    mode="multiple"
                    dropdownRender={(menu) => (
                      <>
                        {menu}

                        <Divider />

                        <Button
                          type="link"
                          onClick={() => setIsVisableAddCategory(true)}
                        >
                          Add new{" "}
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
