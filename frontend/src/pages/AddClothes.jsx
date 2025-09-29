import React from 'react';
import Header from '../components/header';

const AddClothes = ({ loggedIn, logout }) => {
  return (
    <>
      <Header loggedIn={loggedIn} />
    </>
  );
};

export default AddClothes;
