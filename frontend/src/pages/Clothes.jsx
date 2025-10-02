import React from 'react';
import Header from '../components/header';
import ViewClothes from '../components/clothes/viewClothes';
import UploadImages from '../components/clothes/uploadPics';  
import { Link } from 'react-router-dom';


const Clothes = ({ loggedIn, logout }) => {
  return (
    <>
      <Header loggedIn={loggedIn} />
      <UploadImages />
      <Link to="/addclothes">
        <button>Upload Clothes</button>
      </Link>
      <ViewClothes />
      
    </>
  );
};

export default Clothes;
