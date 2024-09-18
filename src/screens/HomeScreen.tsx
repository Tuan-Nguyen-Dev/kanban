/** @format */

import { Button } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { refreshToken, removeAuth } from "../redux/reducers/authReducer";
import handleAPI from "../apis/handleAPI";
import { useAppSelector } from "../redux/hook";
import { StatisticComponent } from "../components";
import { StatisticModel } from "../models/StatisticModel";
import { LiaCoinsSolid } from "react-icons/lia";
import { colors } from "../constants/color";

const HomeScreen = () => {
  const dispatch = useDispatch();
  const auth = useAppSelector((state) => state.authData.data);

  const salesData: StatisticModel[] = [
    {
      key: `sales`,
      description: "Sales",
      color: `${colors.primary500}36`,
      icon: <LiaCoinsSolid size={30} color={colors.primary500} />,
      value: Math.floor(Math.random() * 1000000),
      valueType: "curency",
    },
    {
      key: `revenue`,
      description: "Revenue",
      color: `${colors.primary500}36`,
      icon: <LiaCoinsSolid size={30} color={colors.primary500} />,
      value: Math.floor(Math.random() * 1000000),
      valueType: "number",
    },
    {
      key: `profit`,
      description: "Profit",
      color: `${colors.primary500}36`,
      icon: <LiaCoinsSolid size={30} color={colors.primary500} />,
      value: Math.floor(Math.random() * 1000000),
      valueType: "curency",
    },
    {
      key: `cost`,
      description: "Cost",
      color: `${colors.primary500}36`,
      icon: <LiaCoinsSolid size={30} color={colors.primary500} />,
      value: Math.floor(Math.random() * 1000000),
      valueType: "number",
    },
  ];

  const inventoryDatas: StatisticModel[] = [
    {
      key: `sales`,
      description: "Sales",
      color: `${colors.primary500}36`,
      icon: <LiaCoinsSolid size={30} color={colors.primary500} />,
      value: Math.floor(Math.random() * 1000000),
      valueType: "curency",
      type: "vertical",
    },
    {
      key: `revenue`,
      description: "Revenue",
      color: `${colors.primary500}36`,
      icon: <LiaCoinsSolid size={30} color={colors.primary500} />,
      value: Math.floor(Math.random() * 1000000),
      valueType: "number",
      type: "vertical",
    },
  ];

  return (
    <div className="row">
      <div className="col-md-8">
        <StatisticComponent data={salesData} title="Sales Overview" />
      </div>
      <div className="col-md-4">
        <StatisticComponent data={inventoryDatas} title="Inventory Summary" />
      </div>
    </div>
  );
};

export default HomeScreen;
