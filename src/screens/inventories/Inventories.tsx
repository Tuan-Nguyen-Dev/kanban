import {
  Avatar,
  Button,
  message,
  Modal,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { ColumnProps } from "antd/es/table";
import { Edit2, Trash } from "iconsax-react";
import { useEffect, useState } from "react";
import { MdLibraryAdd } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import handleAPI from "../../apis/handleAPI";
import CategoryComponent from "../../components/CategoryComponent";
import { colors } from "../../constants/color";
import { AddSubProductModal } from "../../modals";
import { ProductModel, SubProductModel } from "../../models/Product";

const { confirm } = Modal;

const Inventories = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [isVisibleAddSubProduct, setIsVisibleAddSubProduct] = useState(false);
  const [productSelected, setProductSelected] = useState<ProductModel>();

  const navigate = useNavigate();

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    setIsLoading(true);
    try {
      const res = await handleAPI(`/products`);
      setProducts(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMixMaxValues = (data: SubProductModel[]) => {
    const nums: number[] = [];

    if (data.length > 0) {
      data.forEach((item) => nums.push(item.price));
    }
    return nums.length > 0
      ? `${Math.min(...nums).toLocaleString()} - ${Math.max(
          ...nums
        ).toLocaleString()} `
      : "";
  };

  const handleRemoveProduct = async (id: string) => {
    const api = `/products/delete?id=${id}`;
    try {
      await handleAPI(api, undefined, "delete");

      setProducts((products) =>
        products.filter((element) => element._id !== id)
      );
      message.success("Product removed!!!");
    } catch (error) {
      console.log(error);
    }
  };

  const columns: ColumnProps<ProductModel>[] = [
    {
      key: "title",
      dataIndex: "",
      title: "Title",
      width: 300,
      render: (items: ProductModel) => (
        <Link to={`/inventory/detail/${items.slug}?id=${items._id}`}>
          {items.title}
        </Link>
      ),
    },
    {
      key: "description",
      dataIndex: "description",
      title: "Description",
      width: 400,
    },
    {
      key: "categories",
      dataIndex: "categories",
      title: "Categories",
      width: 300,

      render: (ids: string[]) => (
        <Space>
          {ids.map((id) => (
            <CategoryComponent id={id} />
          ))}
        </Space>
      ),
    },
    {
      key: "images",
      dataIndex: "images",
      title: "Images",
      render: (imgs: string[]) =>
        imgs &&
        imgs.length > 0 && (
          <Space>
            <Avatar.Group>
              {imgs.map((img) => (
                <Avatar src={img} size={40} />
              ))}
            </Avatar.Group>
          </Space>
        ),
      width: 300,
    },

    {
      key: "colors",
      width: 200,
      dataIndex: "subItems",
      title: "Colors",
      render: (items: SubProductModel[]) => {
        const colors: string[] = [];

        items.forEach(
          (sub) => !colors.includes(sub.color) && colors.push(sub.color)
        );
        return (
          <Space>
            {colors.length > 0 &&
              colors.map((item, index) => (
                <div
                  style={{
                    width: 24,
                    height: 24,
                    backgroundColor: item,
                    borderRadius: 12,
                  }}
                  key={`colors${item}${index}`}
                />
              ))}
          </Space>
        );
      },
    },

    {
      key: "price",
      dataIndex: "subItems",
      width: 300,
      title: "Price",
      render: (items: SubProductModel[]) => (
        <Typography.Text>{getMixMaxValues(items)}</Typography.Text>
      ),
    },
    {
      key: "sizes",
      dataIndex: "subItems",
      width: 150,

      title: "Sizes",
      render: (items: SubProductModel[]) => (
        <Space wrap>
          {items.length > 0 &&
            items.map((item) => (
              <Tag key={`size${item.size}`}>{item.size}</Tag>
            ))}
        </Space>
      ),
    },
    {
      key: "stock",
      width: 100,
      dataIndex: "subItems",
      title: "Stock",
      render: (items: SubProductModel[]) =>
        items.reduce((a, b) => a + b.qty, 0),
      align: "right",
    },

    {
      key: "action",
      title: "Action",
      dataIndex: "",
      render: (item: ProductModel) => (
        <Space>
          <Tooltip title="Add sub product" key={"addSubProduct"}>
            <Button
              icon={<MdLibraryAdd color={colors.primary500} size={20} />}
              type="text"
              onClick={() => {
                setProductSelected(item);
                setIsVisibleAddSubProduct(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Edit sub product" key={"btnEdit"}>
            <Button
              icon={<Edit2 color={colors.primary500} size={20} />}
              type="text"
              onClick={() => {
                navigate(`/inventory/add-product?id=${item._id}`);
              }}
            />
          </Tooltip>
          <Tooltip title="Remove sub product" key={"btnRemove"}>
            <Button
              icon={<Trash className="text-danger" size={20} />}
              type="text"
              onClick={() => {
                confirm({
                  title: "Confirm?",
                  content: "Are you sure delete?",
                  onCancel: () => console.log("Cancel"),
                  onOk: () => handleRemoveProduct(item._id),
                });
              }}
            />
          </Tooltip>
        </Space>
      ),
      align: "right",
      fixed: "right",
      width: 150,
    },
  ];

  return (
    <div>
      <Table
        dataSource={products}
        columns={columns}
        loading={isLoading}
        scroll={{
          x: "100%",
        }}
        size="small"
      />
      <AddSubProductModal
        product={productSelected}
        visible={isVisibleAddSubProduct}
        onClose={() => {
          setProductSelected(undefined);
          setIsVisibleAddSubProduct(false);
        }}
        onAddNew={async (val) => {
          await getProducts();
        }}
      />
    </div>
  );
};

export default Inventories;
