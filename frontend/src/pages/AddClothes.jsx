// AddClothes.js
import React from 'react';
import Header from '../components/header';
import CreateClothes from '../components/clothes/createClothes';
import './Pages.css';

const AddClothes = ({ loggedIn }) => {
  return (
    <div className="full-page">
      <Header loggedIn={loggedIn} />
      <div>
        <h2 className="page-title">Add Clothing Item</h2>
        <CreateClothes />
      </div>
    </div>
  );
};

export default AddClothes;
