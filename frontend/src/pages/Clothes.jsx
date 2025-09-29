import React from 'react';
import Header from '../components/header';
import ViewClothes from '../components/viewClothes';
import ViewMatches from '../components/viewMatches';
import ViewToday from '../components/viewToday';
import { Link } from 'react-router-dom';


const Clothes = ({ loggedIn, logout }) => {
  return (
    <>
      <Header loggedIn={loggedIn} />
      <Link to="/addclothes">
        <button>Upload Clothes</button>
      </Link>
      <ViewClothes />
      <ViewMatches />
      <ViewToday />
    </>
  );
};

export default Clothes;
