// parfumery-backend/routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
    console.log(error);
  }
});

router.post('/', auth, async (req, res) => {
  const { name, price, quantity } = req.body;
  try {
    const newProduct = new Product({ name, price, quantity });
    await newProduct.save();
    res.json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  const { name, price, quantity } = req.body;
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { name, price, quantity }, { new: true });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
