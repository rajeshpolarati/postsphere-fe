import React, { useCallback, useEffect, useMemo, useRef } from "react";
import Post from "./Post";
import {
  deletePostApi,
  getBookmarks,
  getLastestPosts,
  getNetworkPosts,
  getOtherUserPosts,
  getTrendingPosts,
} from "../api/user";
import { useAsync } from "../utils/useAsync";
import { useDispatch, useSelector } from "react-redux";
import { useSetLoading } from "../utils/handlers";
import { usePostSetLoading } from "../utils/util";
import { Spinner } from "@chakra-ui/react";

const UserPostSection = ({ children, posts, showLoading, hasMore }) => {
  const {
    showUserPosts,
    showLatest,
    showTrending,
    showBookmark,
    showNetwork,
    personPosts,
    trending,
    latest,
    bookmark,
    network,
    showPostsLoading,
    currentProfileUser
  } = useSelector((state) => state.posts);
  const {
    data: deletePostRes,
    isLoading: deletePostLoading,
    execute: deletePostCall,
  } = useAsync(deletePostApi);
  const {
    data: trendingPostsList,
    resetState: trendPostReset,
    isLoading: trendingLoading,
    execute: getTrendingPostsList,
  } = useAsync(getTrendingPosts);
  const {
    data: latestPostsList,
    resetState: latestPostReset,
    isLoading: latestLoading,
    execute: getLatestPostsList,
  } = useAsync(getLastestPosts);
  const {
    data: userPostsList,
    resetState: userPostReset,
    isLoading: userPostLoading,
    execute: getuserPostsList,
  } = useAsync(getOtherUserPosts);
  const {
    data: bookmarksList,
    resetState: bookmarkReset,
    isLoading: bookMarksLoading,
    execute: getBookmarksList,
  } = useAsync(getBookmarks);
  const {
    data: networkList,
    resetState: networkReset,
    isLoading: networkListLoading,
    execute: getNetworkList,
  } = useAsync(getNetworkPosts);

  const observer = useRef(null);
  const dispatch = useDispatch();
  const deletePost = async (postId) => {
    await deletePostCall(postId);
  };
  const lastChildCallBack = useCallback(
    (node) => {
      if (showLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        async (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            if (showUserPosts) {
              await getuserPostsList({
                ...personPosts,
                page: personPosts.page + 1,
              }, currentProfileUser);
            }
            if (showLatest) {
              await getLatestPostsList({ ...latest, page: latest.page + 1 });
            }
            if (showTrending) {
              await getTrendingPostsList({
                ...trending,
                page: trending.page + 1,
              });
            }
            if (showBookmark) {
              await getBookmarksList({ ...bookmark, page: bookmark.page + 1 });
            }
            if (showNetwork) {
              await getNetworkList({ ...network, page: network.page + 1 });
            }
          }
        },
        {
          rootMargin: "100px",
        }
      );
      if (node) {
        observer.current.observe(node);
      }
    },
    [showLoading, hasMore, personPosts, trending, latest, bookmark, network, currentProfileUser]
  );
  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);
  useEffect(() => {
    if (trendingPostsList?.data) {
      dispatch({ type: "ADD_TRENDING_POSTS", payload: trendingPostsList.data });
      trendPostReset();
    }
  }, [trendingPostsList]);

  useEffect(() => {
    if (latestPostsList?.data) {
      dispatch({ type: "ADD_LATEST_POSTS", payload: latestPostsList.data });
      latestPostReset();
    }
  }, [latestPostsList]);

  useEffect(() => {
    if (userPostsList?.data) {
      dispatch({ type: "ADD_USER_POSTS", payload: userPostsList.data });
      userPostReset();
    }
  }, [userPostsList]);

  useEffect(() => {
    if (networkList?.success) {
      dispatch({ type: "ADD_NETWORK_PEOPLE_POSTS", payload: networkList.data });
      networkReset();
    }
  }, [networkList]);

  useEffect(() => {
    if (bookmarksList?.success) {
      dispatch({ type: "ADD_BOOKMARKS", payload: bookmarksList.data });
      bookmarkReset();
    }
  }, [bookmarksList]);

  useEffect(() => {
    if (deletePostRes?.success) {
      if (showTrending) {
        dispatch({
          type: "UPDATE_TRENDING_POSTS",
          payload: deletePostRes.data,
        });
      } else if (showLatest) {
        dispatch({ type: "UPDATE_LATEST_POSTS", payload: deletePostRes.data });
      } else if (showBookmark) {
        dispatch({
          type: "UPDATE_USER_BOOKMARKS",
          payload: deletePostRes.data,
        });
      } else if (showUserPosts) {
        dispatch({ type: "UPDATE_USER_POSTS", payload: deletePostRes.data });
      }
    }
  }, [deletePostRes]);

  const deleteShowLoading = useMemo(() => {
    return deletePostLoading;
  }, [deletePostLoading]);

  const setLoading = useMemo(() => {
    return (
      trendingLoading ||
      latestLoading ||
      userPostLoading ||
      bookMarksLoading ||
      networkListLoading
    );
  }, [
    trendingLoading,
    latestLoading,
    userPostLoading,
    bookMarksLoading,
    networkListLoading,
  ]);

  useSetLoading(deleteShowLoading);
  usePostSetLoading(setLoading);
  return (
    <>
      <div className="user_post_section">
        {children}
        {posts?.map((post, index) => {
          if (posts?.length === index + 1) {
            return (
              <Post
                post={post}
                index={post?.id}
                deletePost={deletePost}
                refFunc={lastChildCallBack}
                key={index}
              />
            );
          } else {
            return (
              <Post post={post} index={post?.id} deletePost={deletePost}  key={index}/>
            );
          }
        })}
      </div>
    
      {showPostsLoading?.length ? 
        <div className="spinner">
        <Spinner color="var(--star-color-primary)"  />
        </div>
      : ""}
    </>
  );
};

export default UserPostSection;
