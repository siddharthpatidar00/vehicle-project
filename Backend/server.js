// server.js
const express = require('express');
const path = require('path')
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const adminRoutes = require('./src/routes/adminRoutes');
const usersRoutes = require('./src/routes/usersRoutes')
const staffRoutes = require('./src/routes/staffRoutes')
const vehicleCategoryRoutes = require('./src/routes/vehicleCategoryRoutes')
const vehicleBrandRoutes = require('./src/routes/vehicleBrandRoutes')
const vehicleTransportRoutes = require('./src/routes/vehicleTransportRoutes')
const vehicleEnquiryRoutes = require('./src/routes/vehicleEnquiryRoutes')
const vehiclesRoutes = require('./src/routes/vehiclesRoutes')

const { errorHandler } = require('./src/middleware/errorMiddleware');

const { protect } = require('./src/middleware/authMiddleware');
const cors = require('cors');

dotenv.config();
connectDB();
const app = express();

// 🔥 ADD CORS Middleware BEFORE your routes
app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));


app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));


// Example protected route
app.get('/api/protected', protect, (req, res) => {
    res.json({ message: `Hello ${req.user.role} ${req.user.username}` });
});

app.use('/api/admin', adminRoutes);
// new routes 
app.use('/api/users',usersRoutes)
app.use('/api/staff',staffRoutes)
app.use('/api/vehicles', vehiclesRoutes);
app.use('/api/vehicle-category',vehicleCategoryRoutes)
app.use('/api/vehicle-brand',vehicleBrandRoutes)
app.use('/api/vehicle-transport',vehicleTransportRoutes)
app.use('/api/vehicle-enquiries', vehicleEnquiryRoutes);


app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
