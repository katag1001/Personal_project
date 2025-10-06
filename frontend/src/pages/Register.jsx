import React, { useState } from 'react';
import axios from 'axios';
import Header from '../components/header';
import './Pages.css';


const Register = ({ loggedIn, logout }) => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    password2: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/users/register', form);
      setMessage(res.data.message);
      if (res.data.ok) {
        setForm({ email: '', password: '', password2: '' });
      }
    } catch (error) {
      setMessage('Registration failed');
    }
  };

  return (
    
    <div className="full-page">
      <Header loggedIn={loggedIn} />
      <h2>Register</h2>
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
        <input
          name="password2"
          type="password"
          placeholder="Confirm Password"
          value={form.password2}
          onChange={handleChange}
          required
        /><br/>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
