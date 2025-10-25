import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import { useLocation } from "react-router-dom";
import { useFetch } from "../hooks/use-fetch";

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_USER":
      return { ...state, user: action.payload, loading: false, error: null };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "LOGOUT":
      return { ...state, user: null, loading: false, error: null };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    loading: true,
    error: null,
  });

  const location = useLocation();
  const { request } = useFetch();

  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        dispatch({ type: "SET_LOADING", payload: false });
        return;
      }

      const response = await request({
        url: "/users/me",
        method: "GET",
      });

      if (response.success) {
        dispatch({ type: "SET_USER", payload: response.data.data });
      } else {
        if (response?.status !== 401) {
          localStorage.removeItem("accessToken");
        }
        dispatch({ type: "SET_LOADING", payload: false });
      }
    } catch (error) {
      console.error("Auth check error:", error);
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [request]);

  useEffect(() => {
    const isAuthRoute = location.pathname.startsWith("/auth");
    if (!isAuthRoute) {
      checkAuth();
    } else {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [checkAuth, location.pathname]);

  const logout = async () => {
    try {
      await request({
        url: "/auth/logout",
        method: "POST",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("accessToken");
      dispatch({ type: "LOGOUT" });
    }
  };

  const value = {
    ...state,
    checkAuth,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
