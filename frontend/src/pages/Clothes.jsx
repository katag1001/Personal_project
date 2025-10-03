import React from 'react';
import Header from '../components/header';
import ViewClothes from '../components/clothes/viewClothes';
import { Link } from 'react-router-dom';
import './Clothes.css';

const Clothes = ({ loggedIn, logout }) => {
  return (
    <>
      <Header loggedIn={loggedIn} />
      <div className="clothes-page-container">
        <Link to="/addclothes">
          <button className="upload-clothes-button">Upload Clothes</button>
        </Link>
        <ViewClothes />
      </div>
    </>
  );
};

export default Clothes;
