import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Post from "./Post";
import PostAcomment from "./PostAcomment";
import Comment from "./Comment";
import CreatePost from "./CreatePost";
import { useLocation } from "react-router-dom";
import Home from "./Home";
import { useToast } from "@chakra-ui/react";
import { useAsync } from "../utils/useAsync";
import {
  addComment,
  deleteComment,
  getComments,
  getSpecificPost,
} from "../api/user";
import { useSetLoading } from "../utils/handlers";
import { handleSuccesToast } from "../utils/util";

const UserPost = () => {
  const {
    data: commentCreatedData,
    resetState,
    isLoading,
    execute: createComment,
  } = useAsync(addComment);
  const {
    data: getCommentData,
    resetState: resetCommentData,
    isLoading: getCommentLoading,
    execute: getComment,
  } = useAsync(getComments);
  const {
    data: getPostData,
    resetState: resetPOst,
    isLoading: postLoading,
    execute: getPost,
  } = useAsync(getSpecificPost);

  const [filters, setFilters] = useState({ page: 0, pageSize: 10 });
  const [hasMore, setHasMore] = useState(true);
  const [comments, setComments] = useState([]);
  const [getCommentss, setGetComments] = useState(false);
  const location = useLocation();
  const [commentText, setCommentText] = useState("");
  const [post, setPost] = useState({});
  const observer = useRef(null);
  const toast = useToast();

  const handleComment = async () => {
    if (location?.state?.post?._id) {
      await createComment({
        comment: commentText,
        postId: location?.state?.post?._id,
      });
    }
  };

  const handleUpdateComment = (data) => {
    if (data?._id) {
      let filteredComments = comments?.map((c) => {
        if (c?._id === data?._id) {
          return { ...c, comment: data?.comment };
        }
        return c;
      });
      setComments(filteredComments);
    }
  };
  const {
    data: deleteCommentRes,
    isLoading: deletePostLoading,
    execute: deleteCommentApi,
  } = useAsync(deleteComment);

  useEffect(() => {
    if (commentCreatedData?.success) {
      setCommentText("");
      if (commentCreatedData.data) {
        setComments([commentCreatedData.data, ...comments]);
      }
      resetState();
      handleSuccesToast("Comment added", toast);
    }
  }, [commentCreatedData]);
  useEffect(() => {
    console.log({deleteCommentRes, comments});
    if (deleteCommentRes?.success) {
      let filteredComments = comments?.filter(
        (c) => {
          let id = c?._id || c?.id
          return id !== deleteCommentRes?.data?.id 
        }
      );
      setComments(filteredComments);
    }
  }, [deleteCommentRes]);
  useEffect(() => {
    if (location?.state?.post?._id) {
      setGetComments(true);
    }
  }, [location?.state?.post?._id]);
  useEffect(() => {
    if (getCommentss && location?.state?.post?._id) {
      const nextPage = filters.page + 1;
      getPost(location?.state?.post?._id);
      getComment(
        {
          ...filters,
          page: nextPage,
        },
        location?.state?.post?._id
      );
    }
  }, [getCommentss]);

  useEffect(() => {
    if (getCommentData?.success) {
      setFilters({ ...filters, page: filters.page + 1 });
      if (getCommentData.data.length === 0) {
        setHasMore(false);
      }
      setComments([...comments, ...getCommentData.data]);
      resetCommentData();
    }
  }, [getCommentData]);

  useEffect(() => {
    if (getPostData?.success) {
      setPost(getPostData.data);
      resetPOst();
    }
  }, [getPostData]);

  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);
  const showLoading = useMemo(() => {
    return isLoading || deletePostLoading;
  }, [isLoading, deletePostLoading]);
  const lastChildCallBack = useCallback(
    (node) => {
      if (showLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        async (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            const nextPage = filters.page + 1;
            await getComment(
              {
                ...filters,
                page: nextPage,
              },
              location?.state?.post?._id
            );
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
    [showLoading, hasMore, filters]
  );
  useSetLoading(showLoading);
  return (
    <Home>
      <div className="user_post_section">
        <Post post={post} hideSettings={true} />
        <PostAcomment
          setCommentText={setCommentText}
          commentText={commentText}
          handleComment={handleComment}
        />
        {comments.map((comment, index) => {
          if (comments.length === index + 1) {
            return (
              <Comment
                key={index}
                comment={comment}
                lastChildCallBack={lastChildCallBack}
                deleteComment={deleteCommentApi}
                handleUpdateComment={handleUpdateComment}
              />
            );
          } else {
            return (
              <Comment
                key={index}
                comment={comment}
                deleteComment={deleteCommentApi}
                handleUpdateComment={handleUpdateComment}
              />
            );
          }
        })}
      </div>
    </Home>
  );
};

export default UserPost;
