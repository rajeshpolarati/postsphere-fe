import httpClient from "./httpClient";
export const loginApi = (data) => {
    return httpClient({
      method: "POST",
      url: "/login",
      data
    });
};
export const signupApi = (data) => {
    return httpClient({
      method: "POST",
      url: "/register",
      data
    });
};
export const getUserPosts = (data) => {
    return httpClient({
      method: "GET",
      url: "/posts",
      params: data
    });
};

export const getOtherUserPosts = (data, userId) => {
  return httpClient({
    method: "GET",
    url: `/posts/${userId}`,
    params: data
  });
};

export const getTrendingPosts = (data) => {
    return httpClient({
      method: "GET",
      url: "/posts/trending",
      params: data
    });
};

export const getLastestPosts = (data) => {
    return httpClient({
      method: "GET",
      url: "/posts/latest",
      params: data
    });
};

export const addPost = (data) => {
  return httpClient({
    method: "POST",
    url: "/posts/create",
    data
  });
};

export const editPostApi = (data, postId) => {
    return httpClient({
      method: "PUT",
      url: `/posts/${postId}`,
      data: data
    });
};

export const deletePostApi = (postId) => {
    return httpClient({
      method: "DELETE",
      url: `/posts/${postId}`,
    });
};

export const getRecommendation = () => {
    return httpClient({
      method: "GET",
      url: "/users/recommendations",
    });
};

export const getBookmarks = (params) => {
    return httpClient({
      method: "GET",
      url: "/users/bookmarks",
      params
    });
};
export const getNetworkPosts = (params) => {
    return httpClient({
      method: "GET",
      url: "/users/network",
      params
    });
};

export const getProfileInfo = (params) => {
  return httpClient({
    method: "GET",
    url: "/users/profile",
    params
  });
};

export const editUserDetails = (data) => {
  return httpClient({
    method: "POST",
    url: "/users/update",
    data
  });
};

export const getUser = () => {
  return httpClient({
    method: "GET",
    url: `/users`,
  });
}

export const addComment = (data) => {
  return httpClient({
    method: "POST",
    url: "posts/comment",
    data
  });
}

export const updateComment = (data, commentId) => {
  return httpClient({
    method: "PUT",
    url: `posts/comment/${commentId}`,
    data
  });
}

export const deleteComment = (commentId) => {
  return httpClient({
    method: "DELETE",
    url: `posts/comment/${commentId}`,
  });
}

export const getComments = (params,postId) => {
  return httpClient({
    method: "GET",
    url: `posts/comment/${postId}`,
    params
  });
}

export const getSpecificPost = (postId) => {
  return httpClient({
    method: "GET",
    url: `posts/specific/${postId}`
  });
}