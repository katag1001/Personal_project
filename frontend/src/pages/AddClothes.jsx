// AddClothes.js
import React from 'react';
import Header from '../components/header';
import CreateClothes from '../components/clothes/createClothes';
import './Clothes.css';

const AddClothes = ({ loggedIn }) => {
  return (
    <div className="full-page">
      <Header loggedIn={loggedIn} />
      <div>
        <CreateClothes />
      </div>
    </div>
  );
};

export default AddClothes;
