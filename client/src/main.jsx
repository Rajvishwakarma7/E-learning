import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { Provider } from "react-redux";
import { store } from "./Redux/store";
import { Toaster } from "./components/ui/sonner";
import { useLoadUserQuery } from "./Redux/Api/authApi";
import LoadingSpinner from "./components/ui/LoadingSpinner";

function CustomLoading({ children }) {
  const { isLoading } = useLoadUserQuery();
  return <> {isLoading ? <LoadingSpinner /> : <> {children} </>} </>;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <CustomLoading>
        <App />
        <Toaster position="bottom-right" />
      </CustomLoading>
    </Provider>
  </StrictMode>
);
