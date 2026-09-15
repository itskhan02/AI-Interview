import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import store from './redux/store.js'



createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{
          top: 24,
        }}
        toastOptions={{
          className: "",
          duration: 2500,

          style: {
            background: "rgba(15, 23, 42, 0.82)",
            color: "#f8fafc",
            border: "1px solid rgba(255,255,255,0.08)",
            padding: "14px 18px",
            borderRadius: "18px",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            boxShadow:
              "0 10px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)",
            fontSize: "14px",
            fontWeight: "500",
            maxWidth: "420px",
          },

          success: {
            duration: 2200,
            iconTheme: {
              primary: "#14b8a6",
              secondary: "#ecfeff",
            },
            style: {
              border: "1px solid rgba(20, 184, 166, 0.25)",
              background:
                "linear-gradient(135deg, rgba(15,23,42,0.92), rgba(17,24,39,0.88))",
            },
          },

          error: {
            duration: 3200,
            iconTheme: {
              primary: "#f43f5e",
              secondary: "#fff1f2",
            },
            style: {
              border: "1px solid rgba(244, 63, 94, 0.25)",
              background:
                "linear-gradient(135deg, rgba(15,23,42,0.92), rgba(30,10,20,0.88))",
            },
          },

          loading: {
            iconTheme: {
              primary: "#60a5fa",
              secondary: "#dbeafe",
            },
            style: {
              border: "1px solid rgba(96, 165, 250, 0.25)",
            },
          },
        }}
      />
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </StrictMode>,
);
