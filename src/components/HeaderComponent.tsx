/** @format */

import { Avatar, Button, Dropdown, Input, MenuProps, Space } from "antd";
import { Notification, SearchNormal1 } from "iconsax-react";
import { colors } from "../constants/color";
import { useAppSelector } from "../redux/hook";
import { auth } from "../firebase/firebaseConfig";
import { useDispatch } from "react-redux";
import { removeAuth } from "../redux/reducers/authReducer";
import { useNavigate } from "react-router-dom";

const HeaderComponent = () => {
  const user = useAppSelector((state: any) => state.authData.data);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const items: MenuProps["items"] = [
    {
      key: "logout",
      label: "Logout",
      onClick: async () => {
        auth.signOut();
        dispatch(removeAuth({}));
        localStorage.clear();
        navigate("/");
      },
    },
  ];
  return (
    <div className="p-2 row bg-white" style={{ marginLeft: 2 }}>
      <div className="col">
        <Input
          placeholder="Search product, supplier, order"
          style={{
            borderRadius: 100,
            width: "50%",
          }}
          size="large"
          prefix={<SearchNormal1 className="text-muted" size={20} />}
        />
      </div>
      <div className="col text-right">
        <Space>
          <Button
            type="text"
            icon={<Notification size={22} color={colors.gray600} />}
          />
          <Dropdown menu={{ items }}>
            <Avatar src={user.photoUrl} size={40} />
          </Dropdown>
        </Space>
      </div>
    </div>
  );
};

export default HeaderComponent;
