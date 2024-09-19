import { Button, Card, message, Modal, Space, Spin, Tooltip } from "antd";
import Table, { ColumnProps } from "antd/es/table";
import { Edit2, Trash } from "iconsax-react";
import { useEffect, useState } from "react";
import handleAPI from "../../apis/handleAPI";
import { colors } from "../../constants/color";
import { CategoryModel } from "../../models/ProductModel";
import { TreeModel } from "../../models/FormModel";
import { getTreeValues } from "../../utils/getTreeValues";
import { AddCategory } from "../../components";
import { Link } from "react-router-dom";

const { confirm } = Modal;

const Categories = () => {
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [treeValues, setTreeValues] = useState<TreeModel[]>([]);
  const [categorySelected, setCategorySelected] = useState<CategoryModel>();

  useEffect(() => {
    getCategories(`/products/get-categories`, true);
  }, []);

  useEffect(() => {
    const api = `/products/get-categories?page=${page}&pageSize=${pageSize}`;
    getCategories(api);
  }, [page, pageSize]);

  /*
    - Nếu muốn khi một cái gì đó thay đổi thì làm 1 việc gì đó thì sử dụng useEffect với đối số là cái gì đó
    - Luôn luôn có loading khi làm việc với api
    - Luôn luôn hỏi trước khi xoá
  
  */

  const getCategories = async (api: string, isSelect?: boolean) => {
    try {
      setIsLoading(true);

      const res = await handleAPI(api);
      res.data && setCategories(res.data);

      if (isSelect) {
        setTreeValues(getTreeValues(res.data, "parentId"));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const columns: ColumnProps<CategoryModel>[] = [
    {
      key: "title",
      title: "Name",
      dataIndex: "",
      render: (item: CategoryModel) => (
        <Link to={`/categories/detail/${item.slug}?id=${item._id}`}>
          {item.title}
        </Link>
      ),
    },
    {
      key: "description",
      title: "Description",
      dataIndex: "description",
    },
    {
      key: "btnContainer",
      title: "Action",
      dataIndex: "",
      render: (item: any) => (
        <Space>
          <Tooltip title="Edit categories" key={"btnEdit"}>
            <Button
              onClick={() => setCategorySelected(item)}
              icon={<Edit2 size={20} color={colors.gray600} />}
              type="text"
            />
          </Tooltip>
          <Tooltip title="Remove categories" key={"btnRemove"}>
            <Button
              onClick={() => {
                confirm({
                  title: "Confirm?",
                  content: "What are you sure you want to remove this item",
                  onOk: async () => {
                    handleRemove(item._id);
                  },
                });
              }}
              icon={<Trash size={20} className="text-danger" />}
              type="text"
            />
          </Tooltip>
        </Space>
      ),
      align: "right",
    },
  ];

  const handleRemove = async (id: string) => {
    const api = `/products/delete-category?id=${id}`;

    try {
      await handleAPI(api, undefined, "delete");

      setCategories((categories) =>
        categories.filter((element) => element._id !== id)
      );
      message.success("Delete category");
    } catch (error: any) {
      message.error(error.message);
    }
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
        <div className="row">
          <div className="col-md-4">
            <Card title={"Add New"}>
              <AddCategory
                onClose={() => setCategorySelected(undefined)}
                seleted={categorySelected}
                values={treeValues}
                onAddNew={(val) => {
                  if (categorySelected) {
                    const items = [...categories];
                    const index = items.findIndex(
                      (element) => element._id === categorySelected._id
                    );
                    if (index !== -1) {
                      items[index] = val;
                    }
                    setCategories(items);
                    setCategorySelected(undefined);
                  } else {
                    getCategories(
                      `/products/get-categories?page=${page}&pageSize=${pageSize}`
                    );
                  }
                }}
              />
            </Card>
          </div>
          <div className="col-md-8">
            <Card>
              <Table size="small" dataSource={categories} columns={columns} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
