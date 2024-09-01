import { Button, message } from "antd";
import React, { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../../firebase/firebaseConfig";
import { useDispatch } from "react-redux";
// import handleAPI from "apis/handleAPI";
// import { addAuth } from "redux/reducers/authReducer";
// import { addAuth } from "../../../redux/reducers/authReducer";
import handleAPI from "../../../apis/handleAPI";
import { addAuth } from "../../../redux/reducers/authReducer";
import { localDataName } from "../../../constants/appInfo";

interface Props {
  isRemember?: boolean;
}

const provider = new GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
provider.setCustomParameters({
  login_hint: "nguyenductuanff2003@gmail.com",
});

const SocialLogin = (props: Props) => {
  const { isRemember } = props;
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLoginWithGoogle = async () => {
    setIsLoading(true);

    try {
      const result = await signInWithPopup(auth, provider);

      if (result) {
        const user = result.user;

        if (user) {
          const data = {
            name: user.displayName,
            email: user.email,
          };

          const api = "/auth/google-login";

          try {
            const res: any = await handleAPI(api, data, "post");
            console.log("res", res);
            message.success(res.message);
            dispatch(addAuth(res.data));
            if (isRemember) {
              localStorage.setItem(
                localDataName.authData,
                JSON.stringify(res.data)
              );
            }
          } catch (error: any) {
            console.log(error);
            message.error(error.message);
          } finally {
            setIsLoading(false);
          }
        }
      } else {
        console.log("Can not login with google");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      loading={isLoading}
      onClick={handleLoginWithGoogle}
      style={{
        width: "100%",
      }}
      size="large"
      icon={
        <img
          width={24}
          height={24}
          src="https://img.icons8.com/color/48/google-logo.png"
          alt="google-logo"
        />
      }
    >
      Google
    </Button>
  );
};

export default SocialLogin;
