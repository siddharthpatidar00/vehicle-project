// src/app/config/api.config.ts
import { environment } from '../../environments/environment';

export const API_BASE_URL = environment.apiBaseUrl;

export const API_ENDPOINTS = {
    createUsers: `${API_BASE_URL}/create-users`,
    vehicleCategories: `${API_BASE_URL}/vehicle-category-types`,
    createCountry: `${API_BASE_URL}/country`,
    createCity: `${API_BASE_URL}/cities`,
    createPages: `${API_BASE_URL}/pages`,
    supportTicket: `${API_BASE_URL}/support-ticket`,

    // new
    vehicleBrand:`${API_BASE_URL}/vehicle-brand`,
    vehicleCategory:`${API_BASE_URL}/vehicle-category`,
    users:`${API_BASE_URL}/users`,
    staff:`${API_BASE_URL}/staff`,
    vehicle:`${API_BASE_URL}/vehicles`,
    VehiclesEnquiry:`${API_BASE_URL}/vehicle-enquiries`,
    TransportVehicle:`${API_BASE_URL}/vehicle-transport`
};
