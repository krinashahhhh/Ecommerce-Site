import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import { toast } from 'react-toastify';
import '../styles/ProductDetail.css';
import { useNavigate } from 'react-router-dom';

const ProductDetail = ({ cart, setCart }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get(`/products/${id}`);
        setProduct(res.data);

        const similarRes = await API.get('/products', {  //fetching similar to already..
          params: { category: res.data.category, limit: 5 },
        });
        setSimilar(similarRes.data.products.filter(p => p.id !== parseInt(id)));
      } catch (err) {
        console.error(err);
        toast.error('Product not found!');
      }
    };
    fetchData();
  }, [id]);

  const handleAddToCart = () => {
    const existing = cart.find(p => p.id === product.id);
    if (existing) {
      const updated = cart.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
      setCart(updated);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    toast.success(`${product.name} added to cart!`);
  };

  if (!product) return <p>Loading...</p>;

return (
<>


<div className="breadcrumbs">
  <span onClick={() => navigate('/', { state: { category: '' } })}>Home</span> /
  <span onClick={() => navigate('/', { state: { category: product.category } })}>
    {product.category}
  </span> /
  <span>{product.name}</span>
</div>
    <div className="product-detail-modern">
      <div className="product-detail-text">
        <p className="product-detail-category">{product.category}</p>
        <h1>{product.name}</h1>
        <p className="product-detail-price">${product.price.toFixed(2)}</p>
        <p className="product-detail-desc">{product.description}</p>
        <button onClick={handleAddToCart} className="add-btn">Add to Cart</button>
      </div>

      <div className="product-detail-img-wrapper">
        <img src={product.image} alt={product.name} />
      </div>
    </div>

    <div className="similar-products">
      <h3>Similar Products</h3>
      <div className="similar-grid">
        {similar.slice(0, 4).map((item) => (
          <div
            key={item.id}
            className="similar-card"
            onClick={() => navigate(`/product/${item.id}`)}
          >
            <img src={item.image} alt={item.name} />
            <p>{item.name}</p>
            <p>${item.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  </>

);

};
export default ProductDetail;