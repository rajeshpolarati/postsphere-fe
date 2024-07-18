import React, { useEffect, useMemo } from "react";
import { Text, Input, Button } from "@chakra-ui/react";
import "../styles/login.css";
import { Link, useNavigate } from "react-router-dom";
import { useAsync } from "../utils/useAsync";
import { useDispatch, useSelector } from "react-redux";
import { useSetLoading } from "../utils/handlers";
import { signupApi } from "../api/user";

const Signup = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const { isLoggedIn } = useSelector((state) => state.login);
  const { data: res, isLoading, execute: signUpToApp } = useAsync(signupApi);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let payload = { email, password, lastName, firstName };
    await signUpToApp(payload);
  };
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/home");
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (res?.success) {
      dispatch({ type: "LOGIN_SUCCESS", payload: res?.data });
    }
  }, [res]);

  const showLoading = useMemo(() => {
    return isLoading;
  }, [isLoading]);

  useSetLoading(showLoading);
  return (
    <form className="login_page" onSubmit={handleSubmit}>
      <div className="page_fields header">
        <Text fontSize="2xl">Join PostShare</Text>
      </div>
      <div className="page_fields">
        <Text className="field_label" fontSize="md">
          First Name <span>*</span>
        </Text>
        <Input
          placeholder="First Name"
          size="md"
          type="text"
          required
          value={firstName}
          onChange={(e) => {
            setFirstName(e.target.value);
          }}
        />
      </div>
      <div className="page_fields">
        <Text className="field_label" fontSize="md">
          Last Name <span>*</span>
        </Text>
        <Input
          placeholder="Last Name"
          size="md"
          type="text"
          required
          value={lastName}
          onChange={(e) => {
            setLastName(e.target.value);
          }}
        />
      </div>
      <div className="page_fields">
        <Text className="field_label" fontSize="md">
          Email <span>*</span>
        </Text>
        <Input
          placeholder="your-email@example.com"
          size="md"
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </div>
      <div className="page_fields">
        <Text className="field_label" fontSize="md">
          Password <span>*</span>
        </Text>
        <Input
          placeholder="Password"
          size="md"
          type="password"
          required
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      </div>
      <div className="page_fields footer">
        <Button
          className="btn"
          type="submit"
          variant="solid"
          size="sm"
          isLoading={false}
          loadingText="Joining"
        >
          Join PostShare
        </Button>
        <Text className="footer_text">
          Already have an account ?{" "}
          <Link to="/login" className="other-link">
            Login
          </Link>
        </Text>
      </div>
    </form>
  );
};

export default Signup;
