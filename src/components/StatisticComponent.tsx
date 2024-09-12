import { Card, Space, Typography } from "antd";
import React from "react";
import { colors } from "../constants/color";
import { StatisticModel } from "../modals/StatisticModel";
import { FormatCurrency } from "../utils/formatNumber";

interface Props {
  title: string;
  data: StatisticModel[];
}
const { Title, Text } = Typography;

const StatisticComponent = (props: Props) => {
  const { title, data } = props;

  const renderDescriptionData = (item: StatisticModel) => (
    <>
      <Title
        style={{ fontWeight: 600 }}
        type="secondary"
        className="m-0"
        level={5}
      >
        {item.valueType === "number"
          ? item.value.toLocaleString()
          : FormatCurrency.VND.format(item.value)}
      </Title>
      <Text style={{ fontWeight: 500 }} type="secondary">
        {item.description}
      </Text>
    </>
  );

  return (
    <Card className="mt-2 mb-4">
      <Title style={{ color: colors.gray800, fontWeight: "600", fontSize: 20 }}>
        {title}
      </Title>
      <div className="row mt-3">
        {data.map((item, index) => (
          <div
            className="col"
            key={item.key}
            style={{
              borderRight: `${index < data.length - 1 ? 1 : 0}px solid #e0e0e0`,
            }}
          >
            <div
              className="mb-3"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div>
                <div
                  className="icon-wapper"
                  style={{
                    backgroundColor: item.color,
                  }}
                >
                  {item.icon}
                </div>
              </div>
            </div>

            {!item.type || item.type === "horizontal" ? (
              <Space
                style={{
                  justifyContent: "center",
                  display: "flex",
                }}
              >
                {renderDescriptionData(item)}
              </Space>
            ) : (
              <div className="text-center">{renderDescriptionData(item)}</div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default StatisticComponent;
