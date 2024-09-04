import { Button, message, Modal, Space, Tooltip, Typography } from "antd";
import Table, { ColumnProps } from "antd/es/table";
import { Edit2, Sort, UserRemove } from "iconsax-react";
import { useEffect, useState } from "react";
import handleAPI from "../apis/handleAPI";
import { colors } from "../constants/color";
import { ToogleSupplier } from "../modals";
import { SupplierModel } from "../models/SupplierModel";

const { Title, Text } = Typography;
const { confirm } = Modal;
const Suppliers = () => {
  const [isVisibleModalAddNew, setIsVisibleModalAddNew] = useState(false);
  const [suppliers, setSuppliers] = useState<SupplierModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [supplierSelected, setSupplierSelected] = useState<SupplierModel>();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totals, setTotals] = useState<number>(10);
  const columns: ColumnProps<SupplierModel>[] = [
    {
      key: "index",
      dataIndex: "index",
      title: "#",
      align: "center",
    },
    {
      key: "name",
      title: "Supplier Name",
      dataIndex: "name",
    },
    {
      key: "product",
      title: "Product Name",
      dataIndex: "product",
    },
    {
      key: "contact",
      title: "Contact",
      dataIndex: "contact",
    },
    {
      key: "email",
      title: "Email",
      dataIndex: "email",
    },
    {
      key: "type",
      title: "Type",
      dataIndex: "isTaking",
      render: (isTaking: boolean) => (
        <Text type={isTaking ? "success" : "danger"}>
          {isTaking ? "Taking Return" : "Not Taking Return"}
        </Text>
      ),
    },
    {
      key: "on",
      title: "On the way",
      dataIndex: "active",
      render: (num) => num ?? "-",
      align: "center",
    },
    {
      key: "buttonContainer",
      title: "Action",
      dataIndex: "",
      fixed: "right",
      align: "right",
      render: (item: SupplierModel) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<Edit2 size={20} />}
              className="text-info"
              onClick={() => {
                setSupplierSelected(item), setIsVisibleModalAddNew(true);
              }}
            />
          </Tooltip>

          <Button
            onClick={() =>
              confirm({
                title: "Confirm",
                content: "Are you sure you want remove this supplier?",
                onOk: () => removeSuppliers(item._id),
              })
            }
            type="text"
            icon={<UserRemove size={20} />}
            className="text-danger"
          />
        </Space>
      ),
    },
  ];

  useEffect(() => {
    getSuppiler();
  }, [page, pageSize]);

  const getSuppiler = async () => {
    const api = `/supplier?page=${page}&pageSize=${pageSize}`;

    setIsLoading(true);

    try {
      const res = await handleAPI(api);
      res.data && setSuppliers(res.data.items);
      const items: SupplierModel[] = [];

      res.data.items.forEach((item: any, index: number) => {
        items.push({
          index: (page - 1) * pageSize + (index + 1),
          ...item,
        });
      });
      setSuppliers(items);
      setTotals(res.data.total);
    } catch (error: any) {
      message.error(error.message);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeSuppliers = async (id: string) => {
    try {
      // sorf delete
      await handleAPI(`/supplier/update?id=${id}`, { isDeleted: true }, "put");
      await getSuppiler();
      // await handleAPI(`/supplier/remove?id=${id}`, undefined, "delete");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Table
        pagination={{
          showSizeChanger: true,
          onShowSizeChange: (current, size) => {
            setPageSize(size);
          },
          total: totals,
          onChange(page, pageSize) {
            setPage(page);
          },
        }}
        scroll={{
          y: "calc(100vh - 220px)",
        }}
        loading={isLoading}
        dataSource={suppliers}
        columns={columns}
        title={() => (
          <div className="row">
            <div className="col">
              <Title level={5}>Suppliers</Title>
            </div>
            <div className="col text-right">
              <Space>
                <Button
                  onClick={() => setIsVisibleModalAddNew(true)}
                  type="primary"
                >
                  Add Supplier
                </Button>
                <Button icon={<Sort size={18} color={colors.gray600} />}>
                  Filters
                </Button>
                <Button>Download all</Button>
              </Space>
            </div>
          </div>
        )}
      />
      <ToogleSupplier
        visible={isVisibleModalAddNew}
        onClose={() => {
          supplierSelected && getSuppiler();
          setSupplierSelected(undefined);
          setIsVisibleModalAddNew(false);
        }}
        onAddNew={(val) => setSuppliers([...suppliers, val])}
        supplier={supplierSelected}
      />
    </div>
  );
};

export default Suppliers;
