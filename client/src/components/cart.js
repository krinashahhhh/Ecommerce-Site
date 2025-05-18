import React from 'react';
import '../styles/cart.css';
import { useNavigate } from 'react-router-dom';



const Cart = ({ cart, setCart }) => {


  const increaseQty = (id) => {
    setCart(cart.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
  };
  
  const decreaseQty = (id) => {
    setCart(cart.map(item =>
      item.id === id
        ? { ...item, quantity: item.quantity - 1 }
        : item
    ).filter(item => item.quantity > 0));
  };
  
  const navigate = useNavigate();

return (
    <>
      {cart.length === 0 ? (
        <div className="empty-cart">
          <h2>Your cart is empty 🛒</h2>
         

          <button onClick={() => navigate('/', { state: null })}>
  Continue Shopping
</button>
        </div>
      ) : (
        <div className="cart-items">
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div className="cart-details">
                <h3>{item.name}</h3>
                <p>${item.price.toFixed(2)} × {item.quantity}</p>
                <div className="cart-controls">
                  <button onClick={() => decreaseQty(item.id)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQty(item.id)}>+</button>
                </div>
                <p>Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
          <div className="cart-summary">
            <h3>
              Total: $
              {cart
                .reduce((sum, item) => sum + item.price * item.quantity, 0)
                .toFixed(2)}
            </h3>
            <button className="checkout-btn">Proceed to Checkout</button>

          
  <button className="continue-btn" onClick={() => navigate('/')}>← Continue Shopping</button>



          </div>

        </div>
      )}
    </>
  );
};  

export default Cart;
