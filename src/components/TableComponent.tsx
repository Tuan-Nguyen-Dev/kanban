import React, { ReactNode, useEffect, useState } from "react";
import { FormModel } from "../models/FormModel";
import { Button, Space, Table, Typography } from "antd";
import { Sort } from "iconsax-react";
import { colors } from "../constants/color";
import { ColumnProps } from "antd/es/table";
import { Resizable } from "re-resizable";
import { utils, writeFileXLSX } from "xlsx";
import { ModalExportExcel } from "../modals";

interface Props {
  forms: FormModel;
  loading?: boolean;
  record: any[];
  onPageChange: (val: { page: number; pageSize: number }) => void;
  onAddNew: () => void;
  scrollHeight?: string;
  total: number;
  extraColum?: (item: any) => void;
  api: string;
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
    api,
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
  const [isVisbleModalExport, setIsVisbleModalExport] = useState(false);

  useEffect(() => {
    onPageChange(pageInfo);
  }, [pageInfo]);

  useEffect(() => {
    if (forms && forms.formItems && forms.formItems.length > 0) {
      const items: any[] = [];

      forms.formItems.forEach((item: any) => {
        items.push({
          key: item.key,
          dataIndex: item.value,
          title: item.label,
          width: item.displayLength,
        });
      });
      items.unshift({
        key: "index",
        dataIndex: "index",
        title: "#",
        align: "center",
        width: 100,
      });
      if (extraColum) {
        items.push({
          key: "actions",
          dataIndex: "",
          title: "Action",
          align: "right",
          render: (item: any) => extraColum(item),
          width: 100,
          fixed: "right",
        });
      }

      setColumns(items);
    }
  }, [forms]);

  const RenderTitle = (props: any) => {
    const { children, ...rest } = props;
    return (
      <th {...rest}>
        <Resizable
          enable={{ right: true }}
          onResizeStop={(_e, _direction, _ref, d) => {
            const item = columns.find(
              (element) => element.title === children[1]
            );

            if (item) {
              const items = [...columns];
              const newWidth = (item.width as number) + d.width;
              const index = columns.findIndex(
                (element) => element.key === item.key
              );

              if (index !== -1) {
                items[index].width = newWidth;
              }
              setColumns(items);
            }
          }}
        >
          {children}
        </Resizable>
      </th>
    );
  };

  return (
    <>
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
          showQuickJumper: true,
        }}
        scroll={{
          y: scrollHeight ? scrollHeight : "calc(100vh - 220px)",
        }}
        loading={loading}
        dataSource={record}
        columns={columns}
        bordered
        title={() => (
          <div className="row">
            <div className="col">
              <Title level={5}>{forms.title}</Title>
            </div>
            <div className="col text-right">
              <Space>
                <Button onClick={onAddNew} type="primary">
                  Add Supplier
                </Button>
                <Button icon={<Sort size={18} color={colors.gray600} />}>
                  Filters
                </Button>
                <Button onClick={() => setIsVisbleModalExport(true)}>
                  Export Excel
                </Button>
              </Space>
            </div>
          </div>
        )}
        components={{
          header: {
            cell: RenderTitle,
          },
        }}
      />
      <ModalExportExcel
        visblie={isVisbleModalExport}
        onClose={() => setIsVisbleModalExport(false)}
        api={api}
        name={api}
      />
    </>
  );
};

export default TableComponent;
