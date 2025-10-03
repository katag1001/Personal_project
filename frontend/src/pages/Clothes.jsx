import React from 'react';
import Header from '../components/header';
import ViewClothes from '../components/clothes/viewClothes';
import { Link } from 'react-router-dom';


const Clothes = ({ loggedIn, logout }) => {
  return (
    <>
      <Header loggedIn={loggedIn} />
      <Link to="/addclothes">
        <button>Upload Clothes</button>
      </Link>
      <ViewClothes />
      
    </>
  );
};

export default Clothes;
