const express = require('express');
const Car = require('../models/car');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/multerConfig');

const router = express.Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     Car:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - tags
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the car
 *         title:
 *           type: string
 *           description: The title of the car
 *         description:
 *           type: string
 *           description: Description of the car
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Tags associated with the car
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: List of car image URLs
 *         userId:
 *           type: string
 *           description: The ID of the user who owns the car
 */

/**
 * @swagger
 * tags:
 *   name: Cars
 *   description: Car management API
 */

/**
 * @swagger
 * /cars/create:
 *   post:
 *     summary: Create a new car
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Car title
 *               description:
 *                 type: string
 *                 description: Car description
 *               tags:
 *                 type: string
 *                 description: Comma-separated tags
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Car created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Car'
 *       400:
 *         description: Error creating car
 */

/**
 * @swagger
 * /cars/list:
 *   get:
 *     summary: Get all cars of the logged-in user
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of cars
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Car'
 *       400:
 *         description: Error fetching cars
 */

/**
 * @swagger
 * /cars/search:
 *   get:
 *     summary: Search cars by keyword
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Keyword to search in title, description, or tags
 *     responses:
 *       200:
 *         description: List of cars matching the keyword
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Car'
 *       400:
 *         description: Error searching cars
 */

/**
 * @swagger
 * /cars/detail/{id}:
 *   get:
 *     summary: Get details of a specific car
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the car
 *     responses:
 *       200:
 *         description: Car details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Car'
 *       400:
 *         description: Error fetching car details
 *       404:
 *         description: Car not found
 */

/**
 * @swagger
 * /cars/update/{id}:
 *   put:
 *     summary: Update a specific car
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the car
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Updated car title
 *               description:
 *                 type: string
 *                 description: Updated car description
 *               tags:
 *                 type: string
 *                 description: Updated comma-separated tags
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Car updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Car'
 *       400:
 *         description: Error updating car
 */

/**
 * @swagger
 * /cars/delete/{id}:
 *   delete:
 *     summary: Delete a specific car
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the car
 *     responses:
 *       200:
 *         description: Car deleted successfully
 *       400:
 *         description: Error deleting car
 */

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
