import { useToast } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export const useAsync = (apiFunction) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const resetState = () => setData(null)
  const dispatch = useDispatch();
  const execute = useCallback(
    async (...params) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await apiFunction(...params);
        setData(result?.data);
      } catch (error) {
        let message = error?.response?.data?.error || error?.response?.data?.errorCode || error.message || error?.response?.data?.message;
        if (error?.response?.status === 401 ) {
          toast({
            description: message,
            status: "error",
            duration: 2000,
            isClosable: true,
            position: "top",
          });
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          dispatch({type: 'LOGOUT'})
        }else {
          toast({
            description: message,
            status: "error",
            duration: 2000,
            isClosable: true,
            position: "top",
          });
        }
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    },
    [apiFunction]
  );
  return { data, error, isLoading, execute,resetState  };
};
