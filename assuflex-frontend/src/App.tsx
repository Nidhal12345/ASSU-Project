import { Routes, Route } from "react-router-dom";
import SteperFormMain from "./pages/steperFormMain";
import NosGaranties from "./pages/nos-garanties";
import Home from "./pages/home";
import LoginForm from "./pages/auth/login-form";
import SignUp from "./pages/auth/sign-up";
import InsuranceOffres from "./pages/insuranceOffres";
import ContactForm from "./pages/contact-form";
import "react-datepicker/dist/react-datepicker.css";
import { Clients } from "./pages/gestionnaire/clients";
import { Contrats } from "./pages/gestionnaire/contrats";
import { Dashboard } from "./pages/gestionnaire/dashboard";
import { Devis } from "./pages/gestionnaire/devis";
import { Paiements } from "./pages/gestionnaire/paiements";
import { Validation } from "./pages/gestionnaire/validation";
import { ValidationDetail } from "./pages/gestionnaire/validation-detail";
import { Layout } from "./components/gestionnaire/layout";
import { ClientLayout } from "./components/client/client-layout";
import { ClientContrats } from "./pages/client/contrats";
import { ClientDemandes } from "./pages/client/demandes";
import { ClientPaiements } from "./pages/client/paiements";
import { ClientProfil } from "./pages/client/profil";
import PrivateRoute from "./guards/PrivateRoute";
import UnauthorizedPage from "./guards/UnauthorizedPage";
import PublicRoute from "./guards/PublicRoute";
import DocumentUploadForm from "./components/steps/document-upload-form";
import { AdminLayout } from "./components/admin/admin-layout";
import { AdminUserEdit } from "./pages/admin/user-edit";
import { AdminUsers } from "./pages/admin/users";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import { Toaster } from 'react-hot-toast';
import { GestionnaireSinistres } from "./pages/gestionnaire/sinistres";
import { ClientSinistres } from "./pages/client/sinistres";
import { ClaimManagementForm } from "./components/client/claim-management-form";
import { NouvelArticle } from "./pages/admin/articles/nouveau-article";
import { ListeArticles } from "./pages/admin/articles/liste-articles";
import AdminArticleEditPage from "./pages/admin/articles/article-edit";
import { SinistreDetail } from "./pages/gestionnaire/sinistre-detail";
import ArticlesPage from "./pages/article/articles";
import ArticleDetail from "./pages/article/article-detail";
import PaymentCancel from "./pages/payment-cancel";
import PaymentSuccess from "./pages/payment-success";

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<ContactForm />} />
        <Route path="/nos-garanties" element={<NosGaranties />} />
        <Route path="/offre" element={<InsuranceOffres />} />
        <Route path="/insurance" element={<SteperFormMain />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
           <Route path="payment/success" element={<PaymentSuccess />} />
        <Route path="payment/cancel" element={<PaymentCancel />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/articles/:id" element={<ArticleDetail />} />
        <Route path="/FileUpload/:contractId" element={<DocumentUploadForm />} />

        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>

        <Route element={<PrivateRoute allowedRoles={["ROLE_CLIENT"]} />}>
          <Route path="/client" element={<ClientLayout />}>
            <Route index element={<ClientDemandes />} />
            <Route path="contrats" element={<ClientContrats />} />
            <Route path="sinistre" element={<ClientSinistres />} />
            <Route path="paiements" element={<ClientPaiements />} />
            <Route path="sinistre/nouveau" element={<ClaimManagementForm />} />
            <Route path="demandes" element={<ClientDemandes />} />
            <Route path="profil" element={<ClientProfil />} />
          </Route>
        </Route>

        <Route element={<PrivateRoute allowedRoles={["ROLE_GESTIONNAIRE"]} />}>
          <Route path="/gestionnaire" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="devis" element={<Devis />} />
            <Route path="sinistre/:id" element={<SinistreDetail />} />
            <Route path="sinistre" element={<GestionnaireSinistres/>} />
            <Route path="validation" element={<Validation />} />
            <Route path="validation/:id" element={<ValidationDetail />} />
            <Route path="contrats" element={<Contrats />} />
            <Route path="profil" element={<ClientProfil />} />
            <Route path="clients" element={<Clients />} />
            <Route path="paiements" element={<Paiements />} />
          </Route>
        </Route>
        
        <Route element={<PrivateRoute allowedRoles={["ROLE_ADMIN"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
                      <Route index element={<AdminUsers />} />
              <Route path="articles" element={<ListeArticles />} />
          <Route path="articles/nouveau" element={<NouvelArticle />} />
                  <Route path="articles/:id/edit" element={<AdminArticleEditPage />} />
            <Route path="users" index element={<AdminUsers />} />
            <Route path="users/:id" element={<AdminUserEdit />} />
          </Route>
        </Route>

        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
      <Toaster />
    </div>
  );
}