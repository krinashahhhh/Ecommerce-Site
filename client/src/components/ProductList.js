

import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import API from '../api';
import ProductCard from './ProductCard';
import '../styles/main.css';
import { toast } from 'react-toastify';

const deduplicateById = (items) => {
  const seen = new Map();
  items.forEach(item => {
    if (!seen.has(item.id)) {
      seen.set(item.id, item);
    }
  });
  return Array.from(seen.values());
};

const ProductList = ({
  cart, setCart,
  search, setSearch,
  category, setCategory,
  priceRange, setPriceRange,
  sort, setSort,
  isAdding, setIsAdding
}) => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '', category: '', price: '', image: '', description: ''
  });
  const [newProduct, setNewProduct] = useState({
    name: '', category: '', price: '', image: '', description: ''
  });
  const isAddFormValid = Object.values(newProduct).every(Boolean);
  const limit = 10;

  const handleEdit = (product) => {
    setEditingProduct(product);
    setEditForm(product);
  };

  const saveEdit = async () => {
    const { name, category, price, image, description } = editForm;
    if (!name || !category || !price || !image || !description) {
      toast.error('Please fill all fields before saving.');
      return;
    }
    try {
      await API.put(`/products/${editingProduct.id}`, editForm);
      setEditingProduct(null);
      toast.success('Product updated successfully!');
      resetAndFetch(1);
    } catch (err) {
      toast.error('Something went wrong while updating the product.');
    }
  };

  const handleAddProduct = async () => {
    const { name, category, price, image, description } = newProduct;
    if (!name || !category || !price || !image || !description) {
      toast.error('Please fill all fields before submitting.');
      return;
    }
    try {
      await API.post('/products', newProduct);
      setIsAdding(false);
      setNewProduct({ name: '', category: '', price: '', image: '', description: '' });
      toast.success('Product added successfully!');
      resetAndFetch(1);
    } catch (err) {
      toast.error('Something went wrong while adding the product.');
    }
  };


 
  
  
  

  //working code
  const resetAndFetch = async (startPage) => {
    setPage(startPage);
    setHasMore(true);
    setProducts([]); 
  
    try {
      const res = await API.get('/products', {
        params: { page: startPage, limit: 10, search, category, priceRange, sort },
      });
  
      setProducts(res.data.products);
      setPage(startPage + 1);
  
      if (res.data.products.length < 10 || res.data.products.length >= res.data.totalProducts) {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Initial fetch failed:', err);
    }
  };


  //working code rvreetr to this 
const fetchMore = async () => {
  try {
    const res = await API.get('/products', {
      params: { page, limit, search, category, priceRange, sort },
    });

    const newProducts = res.data.products;
    const total = res.data.totalProducts;

    setProducts(prev => {
      const map = new Map();
      [...prev, ...newProducts].forEach(p => {
        map.set(p.id, p);
      });

      const updated = Array.from(map.values());

      if (updated.length >= total || newProducts.length === 0) {
        setHasMore(false);
      }

      return updated;
    });

    setPage(prev => prev + 1);
  } catch (err) {
    console.error('Pagination fetch failed:', err);
  }
};



  const handleAddToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  useEffect(() => {
    resetAndFetch(1);
  }, [search, category, priceRange, sort]);

  return (
    <div className="product-list">

      <InfiniteScroll
        dataLength={products.length}
        next={fetchMore}
        hasMore={hasMore}
        loader={<h4>Loading more...</h4>}
      >
        <div className="product-grid">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleEdit}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </InfiniteScroll>

      {isAdding && (
        <div className="edit-modal">
          <div className="edit-form">
            <h3>Add New Product</h3>
            <input placeholder="Name" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
            <input placeholder="Category" value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} />
            <input placeholder="Price" type="number" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })} />
            <input placeholder="Image URL" value={newProduct.image} onChange={e => setNewProduct({ ...newProduct, image: e.target.value })} />
            <textarea placeholder="Description" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
            <div>
              <button onClick={handleAddProduct} disabled={!isAddFormValid} className="edit-btn">Add</button>
              <button onClick={() => setIsAdding(false)} className="edit-btn" style={{ marginLeft: 10, backgroundColor: '#888' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {editingProduct && (
        <div className="edit-modal">
          <div className="edit-form">
            <h3>Edit Product</h3>
            <input placeholder="Name" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
            <input placeholder="Category" value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })} />
            <input type="number" placeholder="Price" value={editForm.price} onChange={e => setEditForm({ ...editForm, price: parseFloat(e.target.value) })} />
            <input placeholder="Image URL" value={editForm.image} onChange={e => setEditForm({ ...editForm, image: e.target.value })} />
            <textarea placeholder="Description" value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} />
            <div className="edit-actions">
              <button className="edit-btn cancel" onClick={() => setEditingProduct(null)}>Cancel</button>
              <button className="edit-btn" onClick={saveEdit}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;

