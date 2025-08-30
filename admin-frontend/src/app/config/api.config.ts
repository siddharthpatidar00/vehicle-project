// src/app/config/api.config.ts
import { environment } from '../../environments/environment';

export const API_BASE_URL = environment.apiBaseUrl;

export const API_ENDPOINTS = {
    // new
    vehicleBrand:`${API_BASE_URL}/vehicle-brand`,
    vehicleCategory:`${API_BASE_URL}/vehicle-category`,
    users:`${API_BASE_URL}/users`,
    staff:`${API_BASE_URL}/staff`,
    vehicle:`${API_BASE_URL}/vehicles`,
    VehiclesEnquiry:`${API_BASE_URL}/vehicle-enquiries`,
    TransportVehicle:`${API_BASE_URL}/vehicle-transport`,
    Loan:`${API_BASE_URL}/loan-inquiries`,
    Insurance:`${API_BASE_URL}/insurances`
};
