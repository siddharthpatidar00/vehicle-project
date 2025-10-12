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
    Insurance:`${API_BASE_URL}/insurances`,
    HappyCustomer:`${API_BASE_URL}/customer`,
    Contact:`${API_BASE_URL}/contact`,
    Advertisement:`${API_BASE_URL}/advertisements`,
    BothLoginRoutes:`${API_BASE_URL}/login`,
    LoginRegisterUser:`${API_BASE_URL}/users`,
    VehicleListing:`${API_BASE_URL}/vehicles`,
    VehicleInquiry:`${API_BASE_URL}/vehicle-enquiries`,
    VehicleCategory:`${API_BASE_URL}/vehicle-category`,
    sellVehicle:`${API_BASE_URL}/vehicles`,
    LoanInquiry:`${API_BASE_URL}/loan-inquiries`,
    Filter:`${API_BASE_URL}/filter/filters`,
    Customer:`${API_BASE_URL}/customer`,
};
