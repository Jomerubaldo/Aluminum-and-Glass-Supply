import axios from 'axios';

const BASE = 'http://localhost:5000/api';

//CUSTOMER
export const getCustomers = () => axios.get(`${BASE}/customers`);
export const createCustomer = (data) => axios.post(`${BASE}/customers`, data);
export const updateCustomer = (id, data) =>
  axios.put(`${BASE}/customers/${id}`, data);
export const deleteCustomer = (id) => axios.delete(`${BASE}/customers/${id}`);

//PRODUCT
export const getProducts = () => axios.get(`${BASE}/products`);
export const createProduct = (data) => axios.post(`${BASE}/products`, data);
export const updateProduct = (id, data) =>
  axios.put(`${BASE}/products/${id}`, data);
export const deleteProduct = (id) => axios.delete(`${BASE}/products/${id}`);

//SUPPLIER
export const getSuppliers = () => axios.get(`${BASE}/suppliers`);
export const createSupplier = (data) => axios.post(`${BASE}/suppliers`, data);
export const updateSupplier = (id, data) =>
  axios.put(`${BASE}/suppliers/${id}`, data);
export const deleteSupplier = (id) => axios.delete(`${BASE}/suppliers/${id}`);

//MATERIAL
export const getMaterials = () => axios.get(`${BASE}/materials`);
export const createMaterial = (data) => axios.post(`${BASE}/materials`, data);
export const updateMaterial = (id, data) =>
  axios.put(`${BASE}/materials/${id}`, data);
export const deleteMaterial = (id) => axios.delete(`${BASE}/materials/${id}`);

//ORDER
export const getOrders = () => axios.get(`${BASE}/orders`);
export const getOrderById = (id) => axios.get(`${BASE}/orders/${id}`);
export const createOrder = (data) => axios.post(`${BASE}/orders`, data);
export const updateOrder = (id, data) =>
  axios.put(`${BASE}/orders/${id}`, data);
export const deleteOrder = (id) => axios.delete(`${BASE}/orders/${id}`);
export const markOrderAsCompleted = (id) =>
  axios.patch(`${BASE}/orders/${id}/complete`);

//INSTALLATION
export const getInstallations = () => axios.get(`${BASE}/installations`);
export const markInstallationAsDone = (id, data) =>
  axios.patch(`${BASE}/installations/${id}/done`, data);

//SALES
export const getSales = () => axios.get(`${BASE}/sales`);
