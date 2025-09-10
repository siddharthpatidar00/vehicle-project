const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig');
const {
    getAllCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer
} = require('../controllers/customersController');

const { protect, adminOnly } = require('../middleware/authMiddleware');

// PUBLIC: Get all customers
router.get('/', getAllCustomers);

// PUBLIC: Get single customer
router.get('/:id', getCustomerById);

// ADMIN ONLY: Create customer with image
router.post('/', protect, adminOnly, upload.single('image'), createCustomer);

// ADMIN ONLY: Update customer with optional new image
router.put('/:id', protect, adminOnly, upload.single('image'), updateCustomer);

// ADMIN ONLY: Delete customer
router.delete('/:id', protect, adminOnly, deleteCustomer);

module.exports = router;
