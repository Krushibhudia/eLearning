import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth,db } from '../firebase';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    try {
      await auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const submitReview = async (reviewData) => {
    try {
      const { currentUser } = auth;
      if (!currentUser) {
        throw new Error('User not authenticated.');
      }

      await addDoc(collection(db, 'reviews'), {
        userId: currentUser.uid,
        ...reviewData,
        timestamp: new Date(),
      });
      console.log('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user && !user.displayName) {
        const userDocRef = doc(db, "Users", user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          user.displayName = userData.fullname || 'Unknown User';
        }
      }
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    logout,
    submitReview,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} 
    </AuthContext.Provider>
  );
};

export default AuthProvider;
