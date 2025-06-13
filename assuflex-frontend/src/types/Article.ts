export interface Article {
  id: number
  categorie: string
  titre: string
  contenu: string
  datePublication: string
  status?: string
}

export interface ArticleDTO {
  id: number
  categorie: string
  titre: string
  contenu: string
  datePublication: string
  status?: string
}
