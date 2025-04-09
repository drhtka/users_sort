import axios from 'axios';
import { User } from '../types/user';

const API_URL = 'http://localhost:5001/users';

export const fetchUsers = async (): Promise<User[]> => {
  const { data } = await axios.get(API_URL);
  return data;
};

export const updateUser = async (id: number, user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
  const { data } = await axios.put(`${API_URL}/${id}`, user);
  return data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};