import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect after 5 seconds
    const timer = setTimeout(() => {
      navigate("/client/paiements");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 text-green-800 text-center px-4">
      <h1 className="text-3xl font-bold mb-4">✅ Paiement réussi !</h1>
      <p className="text-lg">Merci pour votre souscription.</p>
      <p className="text-sm mt-2">Redirection vers vos paiements en cours...</p>
    </div>
  );
};

export default PaymentSuccess;
