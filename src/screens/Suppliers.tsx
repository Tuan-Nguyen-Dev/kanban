import { Button, Space, Typography } from "antd";
import Table, { ColumnProps } from "antd/es/table";
import { Filter, Sort } from "iconsax-react";
import React, { useState } from "react";
import { colors } from "../constants/color";
import { ToogleSupplier } from "../modals";
import { SupplierModel } from "../models/SupplierModel";

const { Title } = Typography;
const Suppliers = () => {
  const [isVisibleModalAddNew, setIsVisibleModalAddNew] = useState(false);
  const columns: ColumnProps<SupplierModel>[] = [];

  return (
    <div>
      <Table
        dataSource={[]}
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
        onClose={() => setIsVisibleModalAddNew(false)}
        onAddNew={(val) => console.log(val)}
      />
    </div>
  );
};

export default Suppliers;
