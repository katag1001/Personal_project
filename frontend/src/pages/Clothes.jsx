import React from 'react';
import Header from '../components/header';
import ViewClothes from '../components/clothes/viewClothes';
import { Link } from 'react-router-dom';
import './Clothes.css';

const Clothes = ({ loggedIn, logout }) => {
  return (
    <>
  <div className="full-page">
  <Header loggedIn={loggedIn} />
  
  <div className="sticky-upload-container">
    <Link to="/addclothes">
      <button className="top-button">Upload Clothes</button>
    </Link>
  </div>

  <div className="clothes-page-container">
    <ViewClothes />
  </div>
</div>
</>

  );
};

export default Clothes;



