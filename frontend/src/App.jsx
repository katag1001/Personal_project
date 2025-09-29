// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';

import BuildMatches from './pages/BuildMatches';
import Clothes from './pages/Clothes';
import Homepage from './pages/Homepage';
import Matches from './pages/Matches';
import TodayOutfits from './pages/TodayOutfits';
import AddClothes from './pages/AddClothes';
import Enter from './components/Enter.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';

const URL = '/api';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  // Check token on mount
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('token'));
    if (!token) return setLoggedIn(false);

    axios.defaults.headers.common['Authorization'] = token;

    axios.post(`${URL}/users/verify_token`) // 🛠️ Note: corrected endpoint
      .then(response => {
        if (response.data.ok) {
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
          localStorage.removeItem('token');
        }
      })
      .catch(() => setLoggedIn(false));
  }, []);

  // Called by Login page after successful login
  const login = (token) => {
    localStorage.setItem('token', JSON.stringify(token));
    axios.defaults.headers.common['Authorization'] = token;
    setLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setLoggedIn(false);
    console.log('User logged out');
  };

  return (
    <Router>
      <Routes>
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
          path="/"
          element={
            <Homepage
              loggedIn={loggedIn}
              logout={logout}
            />
          }
        />
        <Route path="/addclothes" element={<AddClothes />} />
        <Route path="/buildmatches" element={<BuildMatches />} />
        <Route path="/clothes" element={<Clothes />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/today-outfits" element={<TodayOutfits />} />
        <Route path="/enter/:email/:link" element={<Enter signIn={() => {}} />} />
      </Routes>
    </Router>
  );
};

export default App;
