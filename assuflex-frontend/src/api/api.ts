import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1/quotes",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`,
  },
})

const api2 = axios.create({
  baseURL: "http://localhost:8080/api/v1/contracts",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`,
  },
})

export const fetchClientProfile = async () => {
  try {
    // const response = await api.get('/client/profile')
    //return response.data

    // Données simulées
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          firstName: "Jean",
          lastName: "Dupont",
          email: "jean.dupont@example.com",
          phone: "06 12 34 56 78",
          address: "123 Rue de Paris",
          postalCode: "75001",
          city: "Paris",
        })
      }, 1000)
    })
  } catch (error) {
    console.error("Erreur lors de la récupération du profil:", error)
    throw error
  }
}


export const deleteClaim = async (claimId: string): Promise<void> => {
  try {
    const response = await fetch(`http://localhost:8080/api/v1/claims/${claimId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete claim: ${response.status} ${response.statusText}`);
    }

    // If the API returns data on successful deletion, you can handle it here
    // const result = await response.json();
    //return result;
  } catch (error) {
    console.error('Error deleting claim:', error);
    throw error;
  }
};

export const updateClientProfile = async (profileData: any) => {
  try {
    // Pour la démo, on simule une réponse
    // const response = await api.put('/client/profile', profileData)
    // return response.data

    // Simulation d'une mise à jour
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true })
      }, 1000)
    })
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error)
    throw error
  }
}


export const deleteQuote = async (quoteId: any) => {
  try {
    const response = await api.delete(`/${quoteId}`)
    return response.data
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error)
    throw error
  }
}

// Fonction pour récupérer les devis du client
export const fetchClientQuotes = async () => {
  try {
    const response = await api.get('/client')
    return response.data
  } catch (error) {
    console.error("Erreur lors de la récupération des devis:", error)
    throw error
  }
}

export const fetchClientContracts = async () => {
  try {
     const response = await api2.get('/client')
    return response.data
  } catch (error) {
    console.error("Erreur lors de la récupération des contrats:", error)
    throw error
  }
}

export const fetchAllContracts = async () => {
  
  try {
     const response = await api2.get('')
    return response.data
  } catch (error) {
    console.error("Erreur lors de la récupération des contrats:", error)
    throw error
  }
}


// Fonction pour envoyer des fichiers
export const uploadFiles = async (quoteId: string, files: File[]) => {
  try {
    // Pour la démo, on simule une réponse
    // const formData = new FormData()
    // files.forEach((file, index) => {
    //   formData.append(`file${index + 1}`, file)
    // })
    // formData.append('quoteId', quoteId)
    // const response = await api.post('/client/upload-documents', formData, {
    //   headers: {
    //     'Content-Type': 'multipart/form-data',
    //   },
    // })
    // return response.data

    // Simulation d'un envoi de fichiers
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: "Fichiers téléchargés avec succès" })
      }, 1500)
    })
  } catch (error) {
    console.error("Erreur lors de l'envoi des fichiers:", error)
    throw error
  }
}
