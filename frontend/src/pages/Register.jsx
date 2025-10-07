// src/pages/Register.jsx
import React, { useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import RegisterForm from '../components/RegisterForm';
import './Pages.css';

const Register = ({ loggedIn, logout }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedIn) {
      navigate('/'); 
    }
  }, [loggedIn, navigate]);

  return (
    <div className="full-page">
      <Header loggedIn={loggedIn} />
      <div className="clothes-page-container">
        <h2 className="page-title">Register</h2>
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
