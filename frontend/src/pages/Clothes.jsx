import React from 'react';
import Header from '../components/header';
import ViewClothes from '../components/viewClothes';
import ViewMatches from '../components/viewMatches';
import ViewToday from '../components/viewToday';
import { Link } from 'react-router-dom';


const Clothes = () => {
  return (
    <>
      <Header />
      <Link to="/buildmatches">
        <button>Build Matches</button>
      </Link>
      <ViewClothes />
      <ViewMatches />
      <ViewToday />
    </>
  );
};

export default Clothes;
