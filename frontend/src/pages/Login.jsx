// Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import Header from '../components/header';

const Login = ({ login, logout, loggedIn }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🔍 Submitting form with:', form);

    try {
      const res = await axios.post('/api/users/login', form);
      console.log('✅ Login response:', res.data);
      setMessage(res.data.message);
      if (res.data.ok) {
        login(res.data.token);
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      setMessage('Login failed');
    }
  };

  if (loggedIn) {
    return (
      <div>
        <h2>You are logged in</h2>
        {message && <p>{message}</p>}
        <button onClick={logout}>Logout</button>
      </div>
      
    );
  }

  return (
    <div> 
      <Header />
      <h2>Login</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        /><br/>
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        /><br/>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
