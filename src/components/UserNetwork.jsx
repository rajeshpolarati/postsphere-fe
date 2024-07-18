import React, { useEffect, useMemo, useState } from "react";
import Home from "./Home";
import { useAsync } from "../utils/useAsync";
import { getNetworkPosts } from "../api/user";
import { useDispatch, useSelector } from "react-redux";
import { useSetLoading } from "../utils/handlers";
import UserPostSection from "./UserPostSection";

const UserNetwork = () => {
  const { networkPeoplePosts, hasNetworkPostsMore, showPostsLoading, showNetwork } = useSelector((state) => state.posts);

  const dispatch = useDispatch();
  const {
    data: networkList,
    isLoading: networkListLoading,
    resetState: networkReset,
    execute: getNetworkList,
  } = useAsync(getNetworkPosts);

  useEffect(() => {
    if (networkList?.success) {
      dispatch({ type: "ADD_NETWORK_PEOPLE_POSTS", payload: networkList.data });
      networkReset()
    }
  }, [networkList]);

  useEffect(() => {
    if(showNetwork){
      getNetworkList({pageSize: 10, page: 1})
    }
  }, [showNetwork]);

  useEffect(() => {
    dispatch({ type: "TOGGLE_SHOW_NETWORK" });
  }, []);

  const showLoading = useMemo(() => {
    return networkListLoading;
  }, [networkListLoading]);
  useSetLoading(showLoading);
  return (
    <Home>
      <UserPostSection
        showLoading={showLoading}
        posts={networkPeoplePosts || []}
        hasMore={hasNetworkPostsMore}
      >
        <div className="header_main_content">My Network</div>
        {networkPeoplePosts?.length === 0 && showPostsLoading?.length === 0 ? (
          <div className="empty_list">
            Not linked? Our recommendations can help 😃
          </div>
        ) : (
          ""
        )}
      </UserPostSection>
    </Home>
  );
};

export default UserNetwork;
