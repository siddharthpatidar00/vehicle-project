import { environment } from '../../environments/environment';

export const API_BASE_URL = environment.apiBaseUrl;

export const API_ENDPOINTS = {
    TransportVehicle:`${API_BASE_URL}/vehicle-transport`,
    LoginRegisterUser:`${API_BASE_URL}/users`
};
    