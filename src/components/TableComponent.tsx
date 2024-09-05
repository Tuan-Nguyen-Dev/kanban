import React, { ReactNode, useEffect, useState } from "react";
import { FormModel } from "../models/FormModel";
import { Button, Space, Table, Typography } from "antd";
import { Sort } from "iconsax-react";
import { colors } from "../constants/color";
import { ColumnProps } from "antd/es/table";

interface Props {
  forms: FormModel;
  loading?: boolean;
  record: any[];
  onPageChange: (val: { page: number; pageSize: number }) => void;
  onAddNew: () => void;
  scrollHeight?: string;
  total: number;
  extraColum?: (item: any) => void;
}

const { Title } = Typography;
const TableComponent = (props: Props) => {
  const {
    loading,
    record,
    forms,
    onAddNew,
    onPageChange,
    scrollHeight,
    total,
    extraColum,
  } = props;
  const [pageInfo, setPageInfo] = useState<{
    page: number;
    pageSize: number;
  }>({
    page: 1,
    pageSize: 10,
  });

  const [columns, setColumns] = useState<ColumnProps<any>[]>([]);

  useEffect(() => {
    onPageChange(pageInfo);
  }, [pageInfo]);

  useEffect(() => {
    if (forms && forms.formItems && forms.formItems.length > 0) {
      const items: any[] = [];

      forms.formItems.forEach((item) =>
        items.push({
          key: item.key,
          dataIndex: item.value,
          title: item.label,
        })
      );
      items.unshift({
        key: "index",
        dataIndex: "index",
        title: "#",
        align: "center",
      });
      if (extraColum) {
        items.push({
          key: "action",
          dataIndex: "",
          title: "Action",
          align: "right",
          render: (item: any) => extraColum(item),
        });
      }

      setColumns(items);
    }
  }, [forms]);

  return (
    <div>
      <Table
        pagination={{
          showSizeChanger: true,
          onShowSizeChange: (current, size) => {
            setPageInfo({ ...pageInfo, pageSize: size });
          },
          total,
          onChange(page, pageSize) {
            setPageInfo({ ...pageInfo, page });
          },
        }}
        scroll={{
          y: scrollHeight ? scrollHeight : "calc(100vh - 220px)",
        }}
        loading={loading}
        dataSource={record}
        columns={columns}
        title={() => (
          <div className="row">
            <div className="col">
              <Title level={5}>{forms.title}</Title>
            </div>
            <div className="col text-right">
              <Space>
                <Button onClick={() => onAddNew} type="primary">
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
    </div>
  );
};

export default TableComponent;
