import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//import AddClothes from './pages/AddClothes';
import BuildMatches from './pages/BuildMatches';
import Clothes from './pages/Clothes';
import Homepage from './pages/Homepage';
import Matches from './pages/Matches';
import TodayOutfits from './pages/TodayOutfits';
import AddClothes from './pages/AddClothes';

const App = () => {
  return (
    <Router>
      <Routes>
        
        <Route path="/addclothes" element={<AddClothes />} />
        <Route path="/buildmatches" element={<BuildMatches />} />
        <Route path="/clothes" element={<Clothes />} />
        <Route path="/" element={<Homepage />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/today-outfits" element={<TodayOutfits />} />
        
      </Routes>
    </Router>
  );
};

export default App;

