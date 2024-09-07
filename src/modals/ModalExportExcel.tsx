import {
  Button,
  Checkbox,
  DatePicker,
  Divider,
  List,
  message,
  Modal,
  Space,
} from "antd";
import React, { useEffect, useState } from "react";
import { FormModel } from "../models/FormModel";
import handleAPI from "../apis/handleAPI";
import { Check } from "iconsax-react";
import { DateTime } from "../utils/dateTime";
import { handleExportData } from "../utils/handleExportExcel";

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
  const [timeSelected, setTimeSelected] = useState<string>("ranger");
  const [dates, setDates] = useState({
    start: "",
    end: "",
  });

  useEffect(() => {
    getForm();
  }, [visblie, api]);

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

  const handleExport = async () => {
    let url = ``;
    if (timeSelected !== "all" && dates.start && dates.end) {
      if (new Date(dates.start).getTime() > new Date(dates.end).getTime()) {
        message.error("Thời gian lỗi !!!");
      } else {
        url = `/${api}/get-export-data/?start=${dates.start}&end=${dates.end}`;
      }
    } else {
      url = `/${api}/get-export-data`;
    }

    const data = checkedValues;
    if (Object.keys(data).length > 0) {
      setIsLoading(true);
      try {
        const res = await handleAPI(url, data, "post");
        res.data && (await handleExportData(res.data, api));
        onClose();
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    } else {
      message.error("Please select one key to export");
    }
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
        <Checkbox
          checked={timeSelected === "all"}
          onChange={(val) =>
            setTimeSelected(timeSelected === "all" ? "ranger" : "all")
          }
        >
          Get All
        </Checkbox>

        <Checkbox
          checked={timeSelected === "ranger"}
          onChange={(val) =>
            setTimeSelected(timeSelected === "all" ? "ranger" : "all")
          }
        >
          Date Ranger
        </Checkbox>

        {timeSelected === "ranger" && (
          <Space>
            <RangePicker
              onChange={(val: any) => {
                setDates(
                  val && val[0] && val[1]
                    ? {
                        start: `${DateTime.CalendarDate(val[0])} 00:00:00`,
                        end: `${DateTime.CalendarDate(val[1])} 00:00:00`,
                      }
                    : {
                        start: "",
                        end: "",
                      }
                );
              }}
            />
          </Space>
        )}
      </div>
      <Divider />
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
