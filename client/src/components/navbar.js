import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/navbar.css';


  const Navbar = ({ cartCount, search, setSearch, setIsAdding, resetFilters, userName, onLogout }) => {
    const navigate = useNavigate();
  
    const handleLogoClick = () => {
      resetFilters();      
      navigate('/');       
    };
  
    return (
      <nav className="navbar">
    <div className="navbar-left" onClick={handleLogoClick} style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
  <h2>HushMart</h2>
  <img src="/assets/hush-logo.png" alt="Hush Mart Logo" className="logo-icon" />

</div>
       
      <div className="navbar-center">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search for electronics, groceries and many more..."
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="navbar-right">
        <button className="add-product-btn" onClick={() => setIsAdding(true)}>+ Add Product</button>
        <div className="navbar-greeting">Hello, {userName}</div>
        <span onClick={onLogout} style={{ cursor: 'pointer', marginLeft: '1rem' }}>Logout</span>

        <Link to="/cart" className="cart-icon">
          <FaShoppingCart />
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
