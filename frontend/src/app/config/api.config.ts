import { environment } from '../../environments/environment';

export const API_BASE_URL = environment.apiBaseUrl;

export const API_ENDPOINTS = {
    TransportVehicle:`${API_BASE_URL}/vehicle-transport`,
    LoginRegisterUser:`${API_BASE_URL}/users`,
    VehicleListing:`${API_BASE_URL}/vehicles`,
    VehicleInquiry:`${API_BASE_URL}/vehicle-enquiries`,
    VehicleCategory:`${API_BASE_URL}/vehicle-category`,
    vehicleBrand:`${API_BASE_URL}/vehicle-brand`,
    sellVehicle:`${API_BASE_URL}/vehicles`,
    LoanInquiry:`${API_BASE_URL}/loan-inquiries`,
    Insurance:`${API_BASE_URL}/insurances`,
    Filter:`${API_BASE_URL}/filter/filters`,
    Customer:`${API_BASE_URL}/customer`,
    Advertisement:`${API_BASE_URL}/advertisements`,
    Contact:`${API_BASE_URL}/contact`
};
    