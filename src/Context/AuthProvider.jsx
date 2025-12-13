import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import React, { useEffect, useState } from "react";

import { AuthContext } from "./AuthContext";
import { auth } from "../firebase/firebase.in";

const googleprovider = new GoogleAuthProvider();

import axios from "axios";

export default function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const forgotPass = (email) => {
    setLoading(true);
    return sendPasswordResetEmail(auth, email);
  };

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signInUser = (email, password) => {
    setLoading(true);
    if (!email || !password) {
      return Promise.reject(new Error("Email and password are required"));
    }
    return signInWithEmailAndPassword(auth, email, password);
  };

  const Signinwithgoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleprovider);
  };

  const signoutUser = () => {
    setLoading(true);
    return signOut(auth);
  };

  const updateUserProfile = (name, photo) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const token = await currentUser.getIdToken();
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/role/${currentUser.email}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setRole(response.data.role);
        } catch (error) {
          console.error("Failed to fetch user role", error);
          setRole('member');
        }
      } else {
        setRole(null);
      }

      setLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const authInfo = {
    user,
    role,
    loading,
    createUser,
    signInUser,
    signoutUser,
    forgotPass,
    Signinwithgoogle,
    updateUserProfile,
  };

  return <AuthContext value={authInfo}> {children} </AuthContext>;
}
