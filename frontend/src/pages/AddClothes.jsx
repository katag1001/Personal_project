// AddClothes.js
import React from 'react';
import Header from '../components/header';
import CreateClothes from '../components/clothes/createClothes';


const AddClothes = ({ loggedIn }) => {
  return (
    <>
      <Header loggedIn={loggedIn} />
      <div>
        <h1>Clothing Manager</h1>
        <CreateClothes />
      </div>
    </>
  );
};

export default AddClothes;
