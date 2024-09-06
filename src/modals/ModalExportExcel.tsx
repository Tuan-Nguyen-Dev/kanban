import { Button, Checkbox, DatePicker, List, Modal, Space } from "antd";
import React, { useEffect, useState } from "react";
import { FormModel } from "../models/FormModel";
import handleAPI from "../apis/handleAPI";
import { Check } from "iconsax-react";

interface Props {
  visblie: boolean;
  onClose: () => void;
  name?: string;
  api: string;
}

const { RangePicker } = DatePicker;

const ModalExportExcel = (props: Props) => {
  const { api, onClose, visblie, name } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [isGetting, setIsGetting] = useState(false);
  const [forms, setForms] = useState<FormModel>();
  const [checkedValues, setCheckedValues] = useState<string[]>([]);

  useEffect(() => {
    getForm();
  }, [visblie, api]);

  const handleExport = async () => {
    console.log(checkedValues);
  };

  const getForm = async () => {
    const url = `/${api}/get-form`;
    setIsGetting(true);
    try {
      const res = await handleAPI(url);
      res.data && setForms(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsGetting(false);
    }
  };
  const handleChangeCheckedValue = (val: string) => {
    const items = [...checkedValues];

    const index = items.findIndex((element) => element === val);

    if (index !== -1) {
      items.splice(index, 1);
    } else {
      items.push(val);
    }
    setCheckedValues(items);
  };

  return (
    <Modal
      loading={isGetting}
      width={500}
      okButtonProps={{
        loading: isLoading,
      }}
      open={visblie}
      onClose={onClose}
      onCancel={onClose}
      onOk={handleExport}
      title="Export to Excel"
    >
      <div>
        <Space>
          <RangePicker onChange={(val) => console.log(val)} />
          <Button type="link">Export All </Button>
        </Space>
      </div>
      <div className="mt-2">
        <List
          dataSource={forms?.formItems}
          renderItem={(item) => (
            <List.Item key={item.key}>
              <Checkbox
                checked={checkedValues.includes(item.value)}
                onChange={() => handleChangeCheckedValue(item.value)}
              >
                {item.label}
              </Checkbox>
            </List.Item>
          )}
        />
      </div>
    </Modal>
  );
};

export default ModalExportExcel;
