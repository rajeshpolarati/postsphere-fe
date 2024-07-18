import store from '../store'
import { useEffect } from "react";

export const useSetLoading = value => {
    useEffect(() => {
      store.dispatch({
        type: `SET_LOADING`,
        payload: {
          value
        }
      });
    }, [value]);
  };
