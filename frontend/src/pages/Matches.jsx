import React from 'react';
import Header from '../components/header';
import { Link } from 'react-router-dom';

const Matches = () => {
  return (
    <>
      <Header />
      <Link to="/buildmatches">
        <button>Build Matches</button>
      </Link>
    </>
  );
};

export default Matches;
