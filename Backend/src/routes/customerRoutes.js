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
const { protect,adminOrStaffOnly } = require('../middleware/authMiddleware');
// PUBLIC: Get all customers
router.get('/', getAllCustomers);
// PUBLIC: Get single customer
router.get('/:id', getCustomerById);
// ADMIN ONLY: Create customer with image
router.post('/', protect, adminOrStaffOnly, upload.single('image'), createCustomer);
// ADMIN ONLY: Update customer with optional new image
router.put('/:id', protect, adminOrStaffOnly, upload.single('image'), updateCustomer);
// ADMIN ONLY: Delete customer
router.delete('/:id', protect, adminOrStaffOnly, deleteCustomer);
module.exports = router;
