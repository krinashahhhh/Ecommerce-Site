import React, { useState } from 'react';
import API from '../api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import '../styles/StartPage.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Typewriter } from 'react-simple-typewriter';


const StartPage = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const res = await API.post('/login', {
          email: form.email,
          password: form.password,
        });
        localStorage.setItem('user', JSON.stringify(res.data));
        localStorage.removeItem('visitedMain');
        sessionStorage.removeItem('filters');
        setUser(res.data);  
        toast.success(`Welcome back, ${res.data.name}!`);

        navigate('/', {
          replace: true,
          state: { loginRedirect: true }
        });
      }
        
       else {
        await API.post('/signup', form);
        toast.success('Registered successfully! Please login.');
        setIsLogin(true); 
        setForm({ name: '', email: form.email, password: '' }); 
      }
    } catch (err) {
      console.error('Auth error:', err); 
      const message = err.response?.data?.error || 'Something went wrong!';
      toast.error(message);             
    }
  };

  return (
    <div className="start-page">
       <div className="start-overlay"></div> 
      <div className="start-container">
        <div className="left-section">
        <div className="branding">
        <span>Welcome to Hush Mart</span>

  <img src="/assets/hush-logo.png" alt="Hush Mart Logo" className="logo-icon" />
</div>      
        <div className="tagline">
  <Typewriter
    words={[
      'Smarter Shopping Starts Here',
      'Tap. Scroll. Checkout',
      'Deals you didn’t know you needed',
    ]}
    loop={0} // infinite
    cursor
    typeSpeed={60}
    deleteSpeed={30}
    delaySpeed={2000}
   
  />
</div>
<div className="subheading">
  From groceries to gadgets to everything — your needs, delivered
</div>

        </div>
        <ToastContainer position="top-right" autoClose={3000} />

        <div className="right-section auth-container">
          <form className="auth-form" onSubmit={handleSubmit}>
            <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>

            {!isLogin && (
              <input
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            )}

            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />

            <button type="submit">
              {isLogin ? 'Login' : 'Register'}
            </button>

            <p className="toggle-link" onClick={() => {
              setIsLogin(!isLogin);
              setForm({ name: '', email: '', password: '' });
            }}>
              {isLogin
                ? "Don't have an account? Sign Up"
                : "Already have an account? Login"}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StartPage;
