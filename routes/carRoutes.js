const express = require('express');
const Car = require('../models/car');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/multerConfig');

const router = express.Router();

// Create Car
router.post('/create', authMiddleware, upload.array('images', 10), async (req, res) => {
  try {
    const images = req.files.map((file) => file.path);
    const car = await Car.create({ ...req.body, images, userId: req.userId });
    res.status(201).json(car);
  } catch (err) {
    res.status(400).json({ message: 'Error creating car', error: err.message });
  }
});

// List Cars
router.get('/list', authMiddleware, async (req, res) => {
  try {
    const cars = await Car.find({ userId: req.userId });
    res.status(200).json(cars);
  } catch (err) {
    res.status(400).json({ message: 'Error fetching cars', error: err.message });
  }
});

// Search Cars
router.get('/search', authMiddleware, async (req, res) => {
  const { keyword } = req.query;
  try {
    const cars = await Car.find({
      userId: req.userId,
      $or: [
        { title: new RegExp(keyword, 'i') },
        { description: new RegExp(keyword, 'i') },
        { tags: new RegExp(keyword, 'i') },
      ],
    });
    res.status(200).json(cars);
  } catch (err) {
    res.status(400).json({ message: 'Error searching cars', error: err.message });
  }
});

// Get Car Detail
router.get('/detail/:id', authMiddleware, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car || car.userId.toString() !== req.userId) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.status(200).json(car);
  } catch (err) {
    res.status(400).json({ message: 'Error fetching car details', error: err.message });
  }
});

// Update Car
router.put('/update/:id', authMiddleware, upload.array('images', 10), async (req, res) => {
  try {
    const images = req.files.map((file) => file.path);
    const car = await Car.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { ...req.body, ...(images.length && { images }) },
      { new: true }
    );
    res.status(200).json(car);
  } catch (err) {
    res.status(400).json({ message: 'Error updating car', error: err.message });
  }
});

// Delete Car
router.delete('/delete/:id', authMiddleware, async (req, res) => {
  try {
    await Car.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.status(200).json({ message: 'Car deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting car', error: err.message });
  }
});

module.exports = router;
