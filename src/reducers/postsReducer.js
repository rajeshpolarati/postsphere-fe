const initialState = {
  showPostsLoading: [],
  currentProfileUser: null,
  personPosts: {
    pageSize: 10,
    page: 0,
  },
  trending: {
    pageSize: 10,
    page: 0,
  },
  latest: {
    pageSize: 10,
    page: 0,
  },
  network: {
    pageSize: 10,
    page: 0,
  },
  bookmark: {
    pageSize: 10,
    page: 0,
  },
  showUserPosts: false,
  showLatest: false,
  showTrending: false,
  showNetwork: false,
  showBookmark: false,
  hasTrendingPostsMore: true,
  hasLatestPostsMore: true,
  hasUserPostsMore: true,
  hasNetworkPostsMore: true,
  hasBookmarkPostsMore: true,
  userPosts: [],
  trendingPosts: [],
  latestPosts: [],
  bookmarks: [],
  networkPeoplePosts: [],
  recommendations: [],
};

const previous = {
  showUserPosts: false,
  showLatest: false,
  showTrending: false,
  showNetwork: false,
  showBookmark: false,
  hasTrendingPostsMore: true,
  hasLatestPostsMore: true,
  hasUserPostsMore: true,
  hasNetworkPostsMore: true,
  hasBookmarkPostsMore: true,
};

const resetState = JSON.parse(JSON.stringify(initialState));
export const postsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "TOGGLE_SHOW_POST_LOADING": {
      const { value } = action.payload;
      const showPostsLoading = [...state.showPostsLoading];
      if (value) {
        showPostsLoading.push(value);
      } else {
        showPostsLoading.pop();
      }
      return {
        ...state,
        showPostsLoading,
      };
    }
    case "TOGGLE_SHOW_USER_POSTS":
      return {
        ...state,
        ...previous,
        showUserPosts: true,
        currentProfileUser: action.payload
      };
    case "TOGGLE_SHOW_LATEST":
      return {
        ...state,
        ...previous,
        showLatest: true,
      };
    case "TOGGLE_SHOW_TRENDING":
      return {
        ...state,
        ...previous,
        showTrending: true,
      };
    case "TOGGLE_SHOW_NETWORK":
      return {
        ...state,
        ...previous,
        showNetwork: true,
      };
    case "TOGGLE_SHOW_BOOKMARK":
      return {
        ...state,
        ...previous,
        showBookmark: true,
      };
    case "ADD_USER_POSTS": {
      let hasMore = true;
      if (action.payload?.length === 0) {
        hasMore = false;
      }
      return {
        ...state,
        userPosts: [...state.userPosts, ...action.payload],
        hasUserPostsMore: hasMore,
        personPosts: { ...state.personPosts, page: state.personPosts.page + 1 },
      };
    }
    case "ADD_TRENDING_POSTS": {
      let hasMore = true;
      if (action.payload?.length === 0) {
        hasMore = false;
      }
      return {
        ...state,
        trendingPosts: [...state.trendingPosts, ...action.payload],
        hasTrendingPostsMore: hasMore,
        trending: { ...state.trending, page: state.trending.page + 1 },
      };
    }
    case "ADD_LATEST_POSTS": {
      let hasMore = true;
      if (action.payload?.length === 0) {
        hasMore = false;
      }
      return {
        ...state,
        latestPosts: [...state.latestPosts, ...action.payload],
        hasLatestPostsMore: hasMore,
        latest: { ...state.latest, page: state.latest.page + 1 },
      };
    }
    case "ADD_BOOKMARKS": {
      let hasMore = true;
      if (action.payload?.length === 0) {
        hasMore = false;
      }
      return {
        ...state,
        bookmarks: [...state.bookmarks, ...action.payload],
        hasBookmarkPostsMore: hasMore,
        bookmark: { ...state.bookmark, page: state.bookmark.page + 1 },
      };
    }
    case "ADD_NETWORK_PEOPLE_POSTS": {
      let hasMore = true;
      if (action.payload?.length === 0) {
        hasMore = false;
      }
      return {
        ...state,
        networkPeoplePosts: [...state.networkPeoplePosts, ...action.payload],
        hasNetworkPostsMore: hasMore,
        network: { ...state.network, page: state.network.page + 1 },
      };
    }
    case "UPDATE_USER_BOOKMARKS": {
      let updatedList = state.bookmarks.filter(
        (post) => post.id !== action.payload.id
      );
      return { ...state, bookmarks: updatedList };
    }
    case "UPDATE_NETWORK_PEOPLE_POSTS": {
      let updatedList = state.networkPeoplePosts.filter(
        (post) => post.id !== action.payload.id
      );
      return { ...state, networkPeoplePosts: updatedList };
    }
    case "UPDATE_USER_POSTS": {
      let updatedList = state.userPosts.filter(
        (post) => post._id !== action.payload.id
      );
      return { ...state, userPosts: updatedList };
    }
    case "UPDATE_TRENDING_POSTS": {
      let updatedList = state.trendingPosts.filter(
        (post) => post._id !== action.payload.id
      );
      return { ...state, trendingPosts: updatedList };
    }
    case "UPDATE_LATEST_POSTS": {
      let updatedList = state.latestPosts.filter(
        (post) => post._id !== action.payload.id
      );
      return { ...state, latestPosts: updatedList };
    }
    case "UPDATE_USER_POSTS_PAGE":
      return {
        ...state,
        personPosts: { ...state.personPosts, page: action.payload },
      };
    case "UPDATE_TRENDING_PAGE":
      return {
        ...state,
        trending: { ...state.trending, page: action.payload },
      };
    case "UPDATE_LATEST_PAGE":
      return { ...state, latest: { ...state.latest, page: action.payload } };
    case "UPDATE_BOOKMARK_PAGE":
      return {
        ...state,
        bookmark: { ...state.bookmark, page: action.payload },
      };
    case "UPDATE_NETWORK_PAGE":
      return { ...state, network: { ...state.network, page: action.payload } };
    case "ADD_NEW_POST":
      return { ...state, latestPosts: [action.payload, ...state.latestPosts] };
    case "UPDATE_SPECIFIC_POST": {
      let list = state[action.payload.from];
      let updatedList = list.map((post) =>
        post._id === action.payload?.post?.id
          ? { ...post, ...action.payload.post }
          : post
      );
      return { ...state, [action.payload.from]: updatedList };
    }
    case "ADD_RECOMMENDATIONS": {
      return {
        ...state,
        recommendations: action.payload,
      };
    }
    case "RESET_DEFAULT_STATE": {
      return { ...resetState };
    }
    default:
      return state;
  }
};
