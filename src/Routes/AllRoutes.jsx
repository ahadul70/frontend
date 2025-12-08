import { createBrowserRouter } from "react-router-dom";
import Home from "../Pages/Home/Home";
import Signup from "../Pages/Signup/Signup";
import Signin from "../Pages/Signin/Signin";
import ForgotPass from "../Pages/Forgotpass/ForgotPass";
import Root from "../Layout/Root";
import Authlayout from "../Layout/Authlayout";
import ClubDetails from "../Pages/ClubDetails/ClubDetails";
import PrivateRoute from "./PrivRoutes";
import ClubReg from "../Component/Regsitration/ClubReg";
import DashBoardLayout from "../Layout/DashBoard/DashBoardLayout";
import menberDashboard from "../Layout/DashBoard/menberDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      {
        path: "club/:id",
        element: (
          <PrivateRoute>
            <ClubDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "clubjoin",
        element: (
          <PrivateRoute>
            <ClubReg />
          </PrivateRoute>
        ),
      },
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
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashBoardLayout />
      </PrivateRoute>
    ),
    children: [
      { path: "mydashboard", Component: menberDashboard },
    ],
  },
]);
