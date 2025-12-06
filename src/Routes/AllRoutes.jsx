import { createBrowserRouter } from "react-router-dom";
import Home from "../Pages/Home/Home";
import Signup from "../Pages/Signup/Signup";
import Signin from "../Pages/Signin/Signin";
import ForgotPass from "../Pages/Forgotpass/ForgotPass";
import Root from "../Layout/Root";
import Authlayout from "../Layout/Authlayout";
export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
    ],
  },
  {
    path: "/auth",
    Component: Authlayout,
    children: [
      { path: "registration", Component: Signup },
      { path: "login", Component: Signin },
      { path: "forgotpass", Component: ForgotPass },
    ],
  }
]);
    