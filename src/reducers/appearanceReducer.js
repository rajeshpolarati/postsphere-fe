const initialState = {
    isLoading: [],
  };
  
  export const ApperanceReducer = (state = initialState, action) => {
    switch (action.type) {
      case "SET_LOADING":
        const { value } = action.payload;
        const isLoading = [...state.isLoading];
        if (value) {
          isLoading.push(value);
        } else {
          isLoading.pop();
        }
        return {
          ...state,
          isLoading,
        };
      default:
        return state;
    }
  };