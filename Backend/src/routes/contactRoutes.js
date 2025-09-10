const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// Create a new contact message
router.post('/', contactController.createContact);

// Get all contact messages
router.get('/', contactController.getAllContacts);

// Get a contact message by ID
router.get('/:id', contactController.getContactById);

// Delete a contact message by ID
router.delete('/:id', contactController.deleteContact);

module.exports = router;
