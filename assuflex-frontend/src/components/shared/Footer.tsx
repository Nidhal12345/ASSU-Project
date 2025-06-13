import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
import logo from "../../assets/Orange Minimalist Logo4444.svg"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-8 md:mb-12">
          <div>
            <a href="/home" className="flex items-center group">
              <img
                src={logo}
                alt=""
                className="h-20 sm:h-24 md:h-28 lg:h-32"
                style={{ maxHeight: "120px" }}
              />
            </a>
            <p className="text-gray-400 mb-6">
              Votre courtier en assurance santé, spécialiste des solutions personnalisées pour particuliers et
              professionnels.
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              <a href="#" className="bg-gray-800 p-1.5 sm:p-2 rounded-full hover:bg-blue-600 transition-colors">
                <Facebook className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-1.5 sm:p-2 rounded-full hover:bg-blue-400 transition-colors">
                <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-1.5 sm:p-2 rounded-full hover:bg-pink-600 transition-colors">
                <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-1.5 sm:p-2 rounded-full hover:bg-blue-700 transition-colors">
                <Linkedin className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Nos assurances</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a className="text-gray-400 hover:text-white transition-colors">Pack Jeune actif / Étudiant</a>
              </li>
              <li>
                <a className="text-gray-400 hover:text-white transition-colors">Pack Famille</a>
              </li>
              <li>
                <a className="text-gray-400 hover:text-white transition-colors">Pack Senior / Retraité</a>
              </li>
              <li>
                <a className="text-gray-400 hover:text-white transition-colors">Pack Travailleur Indépendant</a>
              </li>
              <li>
                <a className="text-gray-400 hover:text-white transition-colors">Pack Entreprise / TPE</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Informations</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  À propos de nous
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Actualite
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Contact</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li className="text-gray-400">
                25 Rue de Ponthieu
                <br />
                75008 PARIS
              </li>
              <li className="text-gray-400">Téléphone: 01 89 60 00 06</li>
              <li className="text-gray-400">Email: contact@assuflex.fr</li>
              <li>
                <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Nous contacter
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 sm:pt-8 mt-6 sm:mt-8 text-center text-gray-500 text-xs sm:text-sm">
          <p className="mb-3 sm:mb-4">&copy; {new Date().getFullYear()} ASSUFLEX - Tous droits réservés</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-6">
            <a href="#" className="hover:text-white transition-colors">
              Mentions légales
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Politique de confidentialité
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
