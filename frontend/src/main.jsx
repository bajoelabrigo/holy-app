import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";

import { store } from "./redux/store.js";
import { Provider } from "react-redux";

import { GoogleOAuthProvider } from "@react-oauth/google";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HelpersContextProvider } from "../context/helpersContext.jsx";
import { StrictMode } from "react";
import { SocketContextProvider } from "../context/SocketContext.jsx";

const queryclient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 1000 * 60 * 60, //1hr
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <QueryClientProvider client={queryclient}>
          <GoogleOAuthProvider
            clientId={import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID}
          >
            <SocketContextProvider>
              <HelpersContextProvider>
                <App />
              </HelpersContextProvider>
            </SocketContextProvider>
          </GoogleOAuthProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
