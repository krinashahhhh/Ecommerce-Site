import React from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, onAddToCart, onEdit }) => {
  const fallbackImage = 'https://via.placeholder.com/300x300?text=No+Image';

  const handleAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault(); 
    onAddToCart(product);
    toast.success(`${product.name} added to cart!`, {
      position: 'top-right',
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      theme: 'light',
    });
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    e.preventDefault(); // Prevent navigation
    onEdit(product);
  };

  return (
    <Link to={`/product/${product.id}`} className="product-tile">
      <div className="image-wrapper">
        <img
          src={product.image?.trim() || fallbackImage}
          alt={product.name}
          className="product-img"
        />
        <button className="overlay-btn" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>

      <div className="product-details">
        <p className="product-category">{product.category}</p>
        <h4 className="product-name">{product.name}</h4>
        <p className="product-price">${product.price.toFixed(2)}</p>
      </div>

      <div className="edit-icon" onClick={handleEdit} title="Edit">
        ✏️
      </div>
    </Link>
  );
};

export default ProductCard;



