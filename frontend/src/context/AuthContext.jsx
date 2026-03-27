import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import api from "../services/api";
import { AuthContext } from "./AuthContextInstance";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // Initialize loading based on token existence
  const [loading, setLoading] = useState(() => {
    return !!localStorage.getItem("token");
  });

  useEffect(() => {
    let isMounted = true;
    const token = localStorage.getItem("token");
    
    if (token) {
      api
        .get("/auth/profile")
        .then((response) => {
          if (isMounted) setUser(response.data);
        })
        .catch(() => {
          if (isMounted) {
            localStorage.removeItem("token");
            setUser(null);
          }
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", response.data.token);
    const { token: _token, ...userData } = response.data;
    setUser(userData);
    return response.data;
  };

  const register = async (name, email, password) => {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
    });
    localStorage.setItem("token", response.data.token);
    const { token: _token, ...userData } = response.data;
    setUser(userData);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const refreshUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await api.get("/auth/profile");
      setUser(response.data);
    } catch (error) {
      console.error("Failed to refresh user profile:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, setUser, refreshUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
