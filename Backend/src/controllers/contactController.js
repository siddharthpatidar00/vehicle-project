const Contact = require('../models/Contact');

// CREATE new contact message
exports.createContact = async (req, res) => {
    try {
        const { firstName, lastName, mobile, email, message } = req.body;

        if (!firstName || !lastName || !mobile || !email || !message) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const contact = new Contact({ firstName, lastName, mobile, email, message });
        await contact.save();

        res.status(201).json({ message: 'Message sent successfully!', contact });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// GET all contact messages
exports.getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json(contacts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// GET contact by ID
exports.getContactById = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({ message: 'Message not found.' });
        }
        res.json(contact);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// DELETE contact by ID
exports.deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) {
            return res.status(404).json({ message: 'Message not found.' });
        }
        res.json({ message: 'Message deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};
