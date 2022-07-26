import { FC } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthPage } from "../../pages/auth-page";
import useRoutes from "../../routes/routes";
import styles from "./App.module.css";

const App: FC<any> = () => {
  const routes = useRoutes(null);

  return (
    <div>
      <BrowserRouter>
        {routes}
      </BrowserRouter>
    </div>
  );
};

export default App;

