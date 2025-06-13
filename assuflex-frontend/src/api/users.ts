import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1/transactions",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`,
  },
})

