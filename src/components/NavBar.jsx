import {
  Avatar,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { FaPenNib } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import {
  FiHome,
  FiUsers,
  FiBookmark,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoIosNotificationsOutline, IoIosNotifications } from "react-icons/io";
import { getName } from "../utils/util";

const NavBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { loggedInUser, notifications, showNotifications } = useSelector((state) => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
  };

  return (
    <div className="nav-bar">
      <Drawer onClose={onClose} isOpen={isOpen} size="full" placement="left">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody>
            <div className="menu-options-hamburger">
              <div
                className="menu_option"
                onClick={() => {
                  dispatch({ type: "RESET_DEFAULT_STATE" });
                  navigate("/profile", { state: { userId: loggedInUser?.id } });
                }}
              >
                <span>
                  <CgProfile />
                </span>
                &nbsp;&nbsp;Profile
              </div>
              <div
                className="menu_option"
                onClick={() => {
                  if (!window.location.pathname.startsWith("/home")) {
                    dispatch({ type: "RESET_DEFAULT_STATE" });
                    navigate("/home");
                  }
                }}
              >
                <span>
                  <FiHome />
                </span>
                &nbsp;&nbsp;Home
              </div>
              <div
                className="menu_option"
                onClick={() => {
                  if (!window.location.pathname.startsWith("/mynetwork")) {
                    dispatch({ type: "RESET_DEFAULT_STATE" });
                    navigate("/mynetwork");
                  }
                }}
              >
                <span>
                  <FiUsers />
                </span>
                &nbsp;&nbsp;Network
              </div>
              <div
                className="menu_option"
                onClick={() => {
                  if (!window.location.pathname.startsWith("/bookmarks")) {
                    dispatch({ type: "RESET_DEFAULT_STATE" });
                    navigate("/bookmarks");
                  }
                }}
              >
                <span>
                  <FiBookmark />
                </span>
                &nbsp;&nbsp;Bookmark
              </div>
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <IconButton
        icon={<HamburgerIcon w={6} h={6} size />}
        onClick={() => {
          onOpen(true);
        }}
        className="nav-btn"
      />
      <Text className="logo-text">
        <span>
          <FaPenNib color="var(--star-color-primary)" />{" "}
        </span>{" "}
        &nbsp; PostSphere
      </Text>
      <div className="right-nav">
        <Menu>
          <MenuButton className="notifications" onClick={()=> {
            dispatch({ type: "RESET_NOTIFICATIONS" });
          }}>
            {showNotifications ? <IoIosNotifications/> :<IoIosNotificationsOutline />}
          </MenuButton>
          {notifications?.length ? (
            <MenuList>
              {notifications?.map((notification) => (
                <MenuItem
                  minH="40px"
                  onClick={() => {
                    if (notification?.from === "profile") {
                      dispatch({ type: "RESET_DEFAULT_STATE" });
                      navigate("/profile", notification?.state);
                    }
                    if (notification?.from === "post") {
                      dispatch({ type: "RESET_DEFAULT_STATE" });
                      navigate("/post", notification?.state);
                    }
                  }}
                  className="item-notification"
                >
                  <Avatar
                    name={`N N`}
                    src="https://bit.ly/broken-link"
                    size="xs"
                  />
                  <span className="visible-text">{notification?.message}</span>
                </MenuItem>
              ))}
            </MenuList>
          ) : ''}
        </Menu>
        <Menu isLazy>
          <MenuButton className="logout_show_profile">
          <Avatar
              name={getName(loggedInUser)}
              src="https://bit.ly/broken-link"
              size="md"
              bg={loggedInUser?.color}
            />
          </MenuButton>
          <MenuList className="profile_options">
            <MenuItem>
              <div
                className="menu_option"
                onClick={() => {
                  dispatch({ type: "RESET_DEFAULT_STATE" });
                  navigate("/profile", { state: { userId: loggedInUser?.id } });
                }}
              >
                <span>
                  <CgProfile />
                </span>
                &nbsp;&nbsp;Profile
              </div>
            </MenuItem>
            <MenuItem>
              <div className="menu_option">
                <span>
                  <FiSettings />
                </span>
                &nbsp;&nbsp;Settings
              </div>
            </MenuItem>
            <MenuDivider />
            <MenuItem onClick={handleLogOut}>
              <div className="menu_option menu_option_logout">
                <span>
                  <FiLogOut />
                </span>
                &nbsp;&nbsp;Logout
              </div>
            </MenuItem>
          </MenuList>
        </Menu>
        <FiLogOut className="logout_show" onClick={handleLogOut}/>
      </div>
    </div>
  );
};

export default NavBar;
