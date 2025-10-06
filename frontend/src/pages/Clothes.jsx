import React from 'react';
import Header from '../components/header';
import ViewClothes from '../components/clothes/viewClothes';
import { Link } from 'react-router-dom';
import './Pages.css';

const Clothes = ({ loggedIn, logout }) => {
  return (
    <>
  <div className="full-page">
  <Header loggedIn={loggedIn} />
  <div className="page-container">
  <h2>My Clothes</h2>
  <div className="sticky-upload-container">
    <Link to="/addclothes">
      <button className="top-button">Upload Clothes</button>
    </Link>
  </div>

    <ViewClothes />
</div>
</div>
</>

  );
};

export default Clothes;



