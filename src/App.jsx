// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';

// Pages
import Homepage from './pages/Homepage';
import AddClothes from './pages/AddClothes';
import BuildMatches from './pages/BuildMatches';
import OldMatches from './pages/OldMatches';
import Clothes from './pages/Clothes';
import Matches from './pages/Matches';
import TodayOutfits from './pages/TodayOutfits';
import User from './pages/User';
import Register from './pages/Register';
import Login from './pages/Login';

// Components
import Enter from './components/Enter';
import ProtectedRoute from './components/ProtectedRoute';

const URL = '/api';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isCheckingToken, setIsCheckingToken] = useState(true); 

  // 🔁 Check token and verify on app load
  useEffect(() => {
    console.log('🔁 App loaded. Checking login status...');
    const token = localStorage.getItem('token');
    console.log('🔑 Token from localStorage:', token);

    if (!token) {
      console.log('⚠️ No token found. User is logged out.');
      setLoggedIn(false);
      setIsCheckingToken(false);
      return;
    }

    // Add Bearer prefix if your backend expects it (common practice)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    axios.post(`${URL}/users/verify_token`)
      .then((response) => {
        console.log('✅ Token verification response:', response.data);
        if (response.data.ok) {
          setLoggedIn(true);
          // Extract email correctly from response.data.succ.userEmail
          setUserEmail(response.data.succ?.userEmail || '');
          localStorage.setItem('user', response.data.succ?.userEmail || '');
        } else {
          console.log('❌ Invalid token. Logging out...');
          setLoggedIn(false);
          localStorage.removeItem('token');
        }
        setIsCheckingToken(false);
      })
      .catch((err) => {
        console.log('❌ Token verification failed:', err);
        setLoggedIn(false);
        localStorage.removeItem('token');
        setIsCheckingToken(false);
      });
  }, []);

  // ✅ Called after successful login
  const login = (token) => {
    console.log('📦 Storing token:', token);
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setLoggedIn(true);
    console.log('✅ Login state set to TRUE');
  };

  // ✅ Called to log out the user
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setLoggedIn(false);
    setUserEmail('');
    console.log('✅ Login state set to FALSE');
  };

  // Don't render routes until token verification completes
  if (isCheckingToken) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/register" element={<Register />} />
        <Route
          path="/login"
          element={
            <Login
              login={login}
              logout={logout}
              loggedIn={loggedIn}
            />
          }
        />
        <Route
          path="/enter/:email/:link"
          element={<Enter signIn={() => {}} />}
        />

        {/* Homepage - visible to all, changes based on login */}
        <Route
          path="/"
          element={
            <Homepage
              loggedIn={loggedIn}
              logout={logout}
            />
          }
        />

        {/* Protected Routes */}
        <Route
          path="/addclothes"
          element={
            <ProtectedRoute loggedIn={loggedIn}>
              <AddClothes loggedIn={loggedIn} logout={logout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/buildmatches"
          element={
            <ProtectedRoute loggedIn={loggedIn}>
              <BuildMatches loggedIn={loggedIn} logout={logout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/oldmatches"
          element={
            <ProtectedRoute loggedIn={loggedIn}>
              <OldMatches loggedIn={loggedIn} logout={logout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/clothes"
          element={
            <ProtectedRoute loggedIn={loggedIn}>
              <Clothes loggedIn={loggedIn} logout={logout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/matches"
          element={
            <ProtectedRoute loggedIn={loggedIn}>
              <Matches loggedIn={loggedIn} logout={logout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/today-outfits"
          element={
            <ProtectedRoute loggedIn={loggedIn}>
              <TodayOutfits loggedIn={loggedIn} logout={logout} />
            </ProtectedRoute>
          }
        />

                <Route
          path="/user"
          element={
            <ProtectedRoute loggedIn={loggedIn}>
              <User loggedIn={loggedIn} logout={logout} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
