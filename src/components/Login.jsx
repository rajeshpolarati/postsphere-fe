import React, { useEffect, useMemo } from "react";
import { Text, Input, Button} from "@chakra-ui/react";
import "../styles/login.css";
import { Link, useNavigate } from "react-router-dom";
import { useAsync } from "../utils/useAsync";
import { loginApi } from "../api/user";
import { useSetLoading } from "../utils/handlers";
import { useDispatch, useSelector } from "react-redux";
const Login = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const {isLoggedIn} = useSelector(state=>state.login)
  const {data: res, error, isLoading, execute:loginToApp} = useAsync(loginApi)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let payload = { email, password };
    await loginToApp(payload)
  };

  const handleGuestLogin = async () => {
    await loginToApp( { email:'Johndoe@gmail.com', password: 'test1234' })
  };

  useEffect(() => { 
    if(isLoggedIn){
      navigate("/home")
    }
  },[isLoggedIn]);

  useEffect(() => { 
    if(res?.success){
      dispatch(({ type: "LOGIN_SUCCESS", payload: res.data }))
    }
  },[res]);

  const showLoading = useMemo(() => {
    return isLoading ;
  }, [isLoading]);

  useSetLoading(showLoading)
  return (
    <form className="login_page" onSubmit={handleSubmit}>
      <div className="page_fields header">
        <Text fontSize="2xl" className="text">Log in to Postshare</Text>
      </div>
      <div className="page_fields">
        <Text className="field_label" fontSize="md" >
          User Email <span>*</span>
        </Text>
        <Input placeholder="User Email" size="md" type="email" required value={email} onChange={e =>{
          setEmail(e.target.value)
        }}/>
      </div>
      <div className="page_fields">
        <Text className="field_label" fontSize="md">
          Password <span>*</span>
        </Text>
        <Input placeholder="Password" size="md" type="password" required value={password} onChange={e =>{
          setPassword(e.target.value)
        }} />
      </div>
      <div className="page_fields footer footer_signup">
        <div className="btn-stack">
          <Button
            className="btn"
            type="submit"
            variant="solid"
            size="sm"
            isLoading={false}
          >
            Login
          </Button>
          <Button
            className="btn"
            variant="outline"
            size="sm"
            isLoading={false}
            loadingText="Joining"
            onClick={handleGuestLogin}
          >
            Guest Login
          </Button>
        </div>
        <Text className="footer_text">
        Dont have an account ?{" "}
          <Link to="/signup" className="other-link">
            Join PostShare
          </Link>
        </Text>
      </div>
    </form>
  );
};

export default Login;
