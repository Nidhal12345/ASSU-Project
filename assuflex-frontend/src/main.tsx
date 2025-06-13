import {BrowserRouter} from "react-router-dom"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import '../app/globals.css'
import {store} from "./store/store.ts"
import { Provider } from 'react-redux';
import { ToastProvider } from "@radix-ui/react-toast"
import { AuthProvider } from "./guards/AuthContext.tsx"


ReactDOM.createRoot(document.getElementById("root")!).render(
  <ToastProvider>
  <Provider store={store}>
    <AuthProvider>
  <BrowserRouter>
    <App />
    </BrowserRouter>
    </AuthProvider>
      </Provider>
  </ToastProvider>

)
