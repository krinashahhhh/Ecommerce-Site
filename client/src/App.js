import React, { useState, useEffect,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import ProductList from './components/ProductList';
import Cart from './components/cart';
import Navbar from './components/navbar';
import StartPage from './components/StartPage';
import FilterBar from './components/FilterBar';
import ProductDetail from './components/ProductDetail';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/main.css';

function MainApp() {
  const [showMainSite, setShowMainSite] = useState(() => !!localStorage.getItem('visitedMain'));
  const [cart, setCart] = useState(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedCart = storedUser
      ? localStorage.getItem(`cart_${storedUser.email}`)
      : null;
    return storedCart ? JSON.parse(storedCart) : [];
  });  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [sort, setSort] = useState('latest');
  const [isAdding, setIsAdding] = useState(false);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
 
 
  useEffect(() => {
    if (user) {
      setCategory('');
      setSearch('');
      setPriceRange('');
      setSort('latest');
      setTimeout(() => {
        navigate('/', { replace: true, state: null });
      }, 0);
    }
  }, [user]);


  const location = useLocation();
  const isProductDetail = location.pathname.startsWith('/product');
  const isCartPage = location.pathname === '/cart';
  const forceShowMain = location.pathname.startsWith('/cart');
const navigate =useNavigate();


  useEffect(() => {
    if (location.pathname === '/' && location.state?.category !== undefined) {
      setCategory(location.state.category);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    if (user?.email) {
      const storedCart = localStorage.getItem(`cart_${user.email}`);
      setCart(storedCart ? JSON.parse(storedCart) : []);
    }
  }, [user]);

  useEffect(() => {
    if (user?.email) {
      localStorage.setItem(`cart_${user.email}`, JSON.stringify(cart));
    }
  }, [cart, user]);


  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  const handleStart = () => {
    setShowMainSite(true);
    localStorage.setItem('visitedMain', 'true');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  // working code revert to this piece of code
  useEffect(() => {
    if (user) {
      setCategory('');
      setSearch('');
      setPriceRange('');
      setSort('latest');
  
      setShowMainSite(true); 
      navigate('/', { replace: true });  
    }
  }, [user]);



  
  
  if (!user) return <StartPage setUser={setUser} />;

  return (
    <>
      {!showMainSite && !forceShowMain ? (
        <StartPage onStart={handleStart} setUser={setUser} />
      ) : (
        <>
          <Navbar
            cartCount={cart.length}
            search={search}
            setSearch={setSearch}
            setIsAdding={setIsAdding}
            resetFilters={() => {
              setSearch('');
              setCategory('');
              setPriceRange('');
              setSort('latest');
              setShowMainSite(true); 
            }}
            userName={user?.name || 'User'}  
            onLogout={handleLogout}
          />

          {!isProductDetail && !isCartPage && (
            <FilterBar
              category={category}
              setCategory={setCategory}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              sort={sort}
              setSort={setSort}
              setSearch={setSearch}
            />
          )}

          <Routes>
            <Route
              path="/"
              element={
                <ProductList
                  cart={cart}
                  setCart={setCart}
                  search={search}
                  setSearch={setSearch}
                  category={category}
                  setCategory={setCategory}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  sort={sort}
                  setSort={setSort}
                  isAdding={isAdding}
                  setIsAdding={setIsAdding}
                />
              }
            />
            <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
            <Route path="/product/:id" element={<ProductDetail cart={cart} setCart={setCart} />} />
          </Routes>

          <ToastContainer position="top-right" autoClose={3000} />
        </>
      )}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <MainApp />
    </Router>
  );
}
