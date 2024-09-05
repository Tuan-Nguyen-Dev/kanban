import { Button, message, Modal, Space, Tooltip, Typography } from "antd";
import Table, { ColumnProps } from "antd/es/table";
import { Edit2, Sort, UserRemove } from "iconsax-react";
import { useEffect, useState } from "react";
import handleAPI from "../apis/handleAPI";
import { colors } from "../constants/color";
import { ToogleSupplier } from "../modals";
import { SupplierModel } from "../models/SupplierModel";
import { FormModel } from "../models/FormModel";
import TableComponent from "../components/TableComponent";

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

  const [columns, setColumns] = useState<any[]>([]);
  const [forms, setForms] = useState<FormModel>();
  // const columns: ColumnProps<SupplierModel>[] = [
  //   {
  //     key: "index",
  //     dataIndex: "index",
  //     title: "#",
  //     align: "center",
  //   },
  //   {
  //     key: "name",
  //     title: "Supplier Name",
  //     dataIndex: "name",
  //   },
  //   {
  //     key: "product",
  //     title: "Product Name",
  //     dataIndex: "product",
  //   },
  //   {
  //     key: "contact",
  //     title: "Contact",
  //     dataIndex: "contact",
  //   },
  //   {
  //     key: "email",
  //     title: "Email",
  //     dataIndex: "email",
  //   },
  //   {
  //     key: "on",
  //     title: "On the way",
  //     dataIndex: "active",
  //     render: (num) => num ?? "-",
  //     align: "center",
  //   },
  //   {
  //     key: "type",
  //     title: "Type",
  //     dataIndex: "isTaking",
  //     render: (isTaking: boolean) => (
  //       <Text type={isTaking ? "success" : "danger"}>
  //         {isTaking ? "Taking Return" : "Not Taking Return"}
  //       </Text>
  //     ),
  //   },
  //   {
  //     key: "buttonContainer",
  //     title: "Action",
  //     dataIndex: "",
  //     fixed: "right",
  //     align: "right",
  //     render: (item: SupplierModel) => (
  //
  //     ),
  //   },
  // ];

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    getSuppiler();
  }, [page, pageSize]);

  const getData = async () => {
    setIsLoading(true);
    try {
      await getSuppiler();
      await getForms();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getForms = async () => {
    const api = `/supplier/get-form`;
    const res = await handleAPI(api);
    res.data && setForms(res.data);
  };

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
      {forms && (
        <TableComponent
          total={totals}
          onPageChange={(val) => {
            setPage(val.page);
            setPageSize(val.pageSize);
          }}
          forms={forms}
          record={suppliers}
          loading={isLoading}
          onAddNew={() => setIsVisibleModalAddNew(true)}
          extraColum={(item) => (
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
          )}
        />
      )}
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
