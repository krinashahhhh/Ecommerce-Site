


import '../styles/FilterBar.css';

import React, {useEffect } from 'react';

import { useNavigate, useLocation } from 'react-router-dom';


const FilterBar = ({ category, setCategory, priceRange, setPriceRange, sort, search,setSort, setSearch }) => {

 
const navigate = useNavigate();
const location = useLocation();

useEffect(() => {
  if (location.pathname.startsWith('/product')) {
    navigate('/');
  }
}, [category, priceRange, sort]);




  return (
    <div className="filter-section">
      <div className="filter-bar-modern">
        <span className="filter-heading">Filter:</span>
        {['All', 'Electronics', 'Clothing', 'Footwear', 'Accessories', 'Grocery'].map((cat) => {
  const normalized = cat.toLowerCase();
  return (
    <span
      key={cat}
      className={`filter-option ${category === normalized ? 'active' : ''}`}
      onClick={() => setCategory(cat === 'All' ? '' : normalized)}
    >
      {cat}
    </span>
  );
})}

        <div className="sort-controls">
          <label>Sort:</label>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="latest">Newest</option>
            <option value="priceLow">Price ↑</option>
            <option value="priceHigh">Price ↓</option>
          </select>

          <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
            <option value="">All Prices</option>
            <option value="0-50">Under $50</option>
            <option value="50-100">$50 - $100</option>
            <option value="100-500">$100 - $500</option>
            <option value="500-10000">Over $500</option>
          </select>

          <button className="clear-btn" onClick={() => {
            setCategory('');
            setPriceRange('');
            setSort('latest');
            setSearch('');
          }}>
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
