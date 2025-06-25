import { api } from './api';
import { ApiResponse, PaginatedResponse, Service } from './apiTypes';

export interface CreateServiceDto {
  title: string;
  description: string;
  imageUrl: string;
  price: number;
}

export interface UpdateServiceDto extends Partial<CreateServiceDto> {
  id: number;
}

export interface ServiceQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const serviceApi = {
  // Upload image for service
  uploadImage: async (file: File): Promise<ApiResponse<{ path: string }>> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const { data } = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  // Get all services with pagination
  getServices: async (params: ServiceQueryParams = {}): Promise<PaginatedResponse<Service[]>> => {
    const { data } = await api.get('/services', { params });
    return data;
  },

  // Get single service by ID
  getService: async (id: number): Promise<ApiResponse<Service>> => {
    const { data } = await api.get(`/services/${id}`);
    return data;
  },

  // Create new service
  createService: async (serviceData: CreateServiceDto): Promise<ApiResponse<Service>> => {
    const { data } = await api.post('/services', serviceData);
    return data;
  },

  // Update service
  updateService: async (id: number, serviceData: UpdateServiceDto): Promise<ApiResponse<Service>> => {
    const { data } = await api.patch(`/services/${id}`, serviceData);
    return data;
  },

  // Delete service
  deleteService: async (id: number): Promise<ApiResponse<void>> => {
    const { data } = await api.delete(`/services/${id}`);
    return data;
  },
};
