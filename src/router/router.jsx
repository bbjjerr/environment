// src/router/index.jsx
import AuthRoute from "./AuthRoute";

import { createBrowserRouter } from "react-router-dom";
import Login from "../page/Login";
import Home from "../page/Home";

const router = createBrowserRouter([
  {
    path: "/",

    element: (
      <AuthRoute>
        <Home />
      </AuthRoute>
    ),
  },
  {
    path: "/login",
    element: <Login />, // 登录页不需要保安，否则谁也进不去
  },
]);
export default router;
