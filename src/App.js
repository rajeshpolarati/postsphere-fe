import "./App.css";
import React, { useEffect, useMemo } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./components/Login";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import Signup from "./components/Signup";
import HomePage from "./components/HomePage";
import UserProfile from "./components/UserProfile";
import UserNetwork from "./components/UserNetwork";
import UserBookmarks from "./components/UserBookmarks";
import UserPost from "./components/UserPost";
import { getUser } from "./api/user";
import { useAsync } from "./utils/useAsync";
import { useSetLoading } from "./utils/handlers";
import ErrorBoundary from "./components/ErrorBoundary";

const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac",
  },
};
const theme = extendTheme({ colors });
const MainRoute = ({ children }) => {
  const { isLoading } = useSelector((state) => state.appearance);
  return (
    <div className="App">
      {isLoading?.length ? (
        <ThreeDots
          height="80"
          width="80"
          radius="9"
          color="var(--star-color-primary)"
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          wrapperClass="loader-spinner"
          visible={true}
        />
      ) : (
        ""
      )}
      {children}
    </div>
  );
};
const App = () => {
  const dispatch = useDispatch();
  const { loggedInUser } = useSelector((state) => state.login);
  const { data: loadUser, isLoading, execute } = useAsync(getUser);
  useEffect(() => {
    if (localStorage.getItem("token") && !loggedInUser) {
      execute();
    }
  }, []);
  useEffect(() => {
    if (loadUser?.success) {
      dispatch({ type: "LOGIN_SUCCESS", payload: loadUser.data });
    }
  }, [loadUser]);
  const showLoading = useMemo(() => isLoading, [isLoading]);
  useSetLoading(showLoading);
  return (

      <MainRoute>
        <ChakraProvider theme={theme}>
          <AuthProvider>
            <Router>
              <Routes>
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="home" element={<HomePage />} />
                  <Route path="profile" element={<UserProfile />} />
                  <Route path="profile/:name" element={<UserProfile />} />
                  <Route path="mynetwork" element={<UserNetwork />} />
                  <Route path="bookmarks" element={<UserBookmarks />} />
                  <Route path="post" element={<UserPost />} />
                  <Route path="*" element={<Navigate to="/home" />} />
                </Route>
              </Routes>
            </Router>
          </AuthProvider>
        </ChakraProvider>
      </MainRoute>
  );
};

export default App;
