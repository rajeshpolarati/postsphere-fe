import React, { useEffect, useMemo } from "react";
import "../styles/home.css";
import Home from "./Home";
import { useAsync } from "../utils/useAsync";
import { getLastestPosts } from "../api/user";
import { useDispatch, useSelector } from "react-redux";
import CreatePost from "./CreatePost";
import { usePostSetLoading } from "../utils/util";
import UserPostSection from "./UserPostSection";
const HomePage = () => {
  const {
    data: latestPostsList,
    isLoading: latestLoading,
    execute: getLatestPostsList,
  } = useAsync(getLastestPosts);
  const {
    trendingPosts,
    latestPosts,
    hasTrendingPostsMore,
    hasLatestPostsMore,
    showLatest,
    showTrending,
  } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  useEffect(() => {
    if (showLatest) {
      getLatestPostsList({ page: 1, pageSize: 10 });
    }
  }, [showLatest]);

  useEffect(() => {
    if (latestPostsList?.data) {
      dispatch({ type: "ADD_LATEST_POSTS", payload: latestPostsList.data });
    }
  }, [latestPostsList]);

  useEffect(() => {
    dispatch({ type: "TOGGLE_SHOW_LATEST" });
  }, []);

  const showLoading = useMemo(() => {
    return latestLoading;
  }, [latestLoading]);

  usePostSetLoading(showLoading);

  return (
    <Home>
      <UserPostSection
        showLoading={showLoading}
        posts={
          showTrending
            ? trendingPosts || []
            : showLatest
            ? latestPosts || []
            : []
        }
        hasMore={
          showTrending
            ? hasTrendingPostsMore
            : showLatest
            ? hasLatestPostsMore
            : false
        }
      >
        <CreatePost />
      </UserPostSection>
    </Home>
  );
};

export default React.memo(HomePage);
