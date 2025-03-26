import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryclient = new QueryClient();

createRoot(document.getElementById("root")).render(
    <BrowserRouter>
      <QueryClientProvider client={queryclient}>
        <GoogleOAuthProvider
          clientId={import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID}
        >
          <Provider store={store}>
            <App />
          </Provider>
        </GoogleOAuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
);
