// src/components/ProductList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [productData, setProductData] = useState({ name: '', price: '', quantity: '' });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://app-gest-stock-api.vercel.app/api/products', {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        });
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://app-gest-stock-api.vercel.app/api/products/${id}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setProducts(products.filter(product => product._id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleEdit = async (id) => {
    if (editProduct) {
      try {
        await axios.put(`https://app-gest-stock-api.vercel.app/api/products/${id}`, productData, {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        });
        window.location.reload();
      } catch (error) {
        console.error('Error updating product:', error);
      }
    } else {
      const product = products.find((product) => product._id === id);
      setEditProduct(id);
      setProductData({ name: product.name, price: product.price, quantity: product.quantity });
    }
  };

  const handleChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  if (!products || products.length === 0) {
    return <div>No products available</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product._id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.price}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Quantity: {product.quantity}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  className="text-[#1e272e] hover:text-blue-900 mr-2"
                  onClick={() => handleEdit(product._id)}
                >
                  <FaEdit />
                </button>
                <button
                  className="text-orange-600 hover:text-orange-900"
                  onClick={() => handleDelete(product._id)}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editProduct && (
        <div className="mt-4 p-4 border border-gray-300 rounded">
          <h3 className="text-lg font-semibold mb-2">Edit Product</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEdit(editProduct);
            }}
          >
            <input
              type="text"
              name="name"
              value={productData.name}
              onChange={handleChange}
              className="border p-2 mb-2 w-full"
              placeholder="Product Name"
            />
            <input
              type="number"
              name="price"
              value={productData.price}
              onChange={handleChange}
              className="border p-2 mb-2 w-full"
              placeholder="Product Price"
            />
            <input
              type="number"
              name="quantity"
              value={productData.quantity}
              onChange={handleChange}
              className="border p-2 mb-2 w-full"
              placeholder="Product Quantity"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditProduct(null)}
              className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProductList;
