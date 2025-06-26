import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use((config) => {
  console.log(config)
  const token = localStorage.getItem("jwtToken")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export interface User {
  creationDate: string | number | Date
  CreatedDate: string | number | Date
  id: string
  nom: string
  prenom: string
  email: string
  telephone: string
  role: "ROLE_CLIENT" | "ROLE_GESTIONNAIRE" | "ROLE_ADMIN"
  statut: "actif" | "inactif" | "suspendu"
  dateInscription: string
  derniereConnexion: string
}

export interface UserUpdateData {
  nom?: string
  prenom?: string
  email?: string
  telephone?: string
  role?: string
  statut?: string
}

export interface AddUserData {
  username: string
  email: string
  password: string
  role: string
}

export const getUsers = async (): Promise<User[]> => {
  const response = await api.get("/users")
  return response.data
}

export const getUserById = async (id: string): Promise<User> => {
  const response = await api.get(`/users/${id}`)
  return response.data
}

export const updateUser = async (id: string, data: UserUpdateData): Promise<User> => {
  const response = await api.put(`/users/users/${id}`, data)
  return response.data
}

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/users/${id}`)
}

export const AddUsers = async (data: AddUserData): Promise<User> => {
  const response = await api.post(`/auth/register`, data)
  return response.data
}