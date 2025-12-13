import { createBrowserRouter } from "react-router-dom";
import Home from "../Pages/Home/Home";
import Signup from "../Pages/Signup/Signup";
import Signin from "../Pages/Signin/Signin";
import ForgotPass from "../Pages/Forgotpass/ForgotPass";
import Root from "../Layout/Root";
import Authlayout from "../Layout/Authlayout";
import ClubDetails from "../Pages/ClubDetails/ClubDetails";
import PrivateRoute from "./PrivRoutes";
import DashBoardLayout from "../Layout/DashBoard/DashBoardLayout";
import AdminRoute from "./AdminRoute";
import ManagerRoute from "./ManagerRoute";
import MemberOverview from "../Pages/Dashboard/members/MemberOverview";
import MyClubs from "../Pages/Dashboard/members/MyClubs";
import MyEvents from "../Pages/Dashboard/members/MyEvents";
import MemberProfile from "../Pages/Dashboard/members/MemberProfile";
import PaymentHistory from "../Pages/Dashboard/members/PaymentHistory";
import PaymentClubsFee from "../Pages/Payment/PaymentClubsFee";
import PaymentEventFee from "../Pages/Payment/PaymentEventFee";
import ManageClubs from "../Pages/Dashboard/ClubManager/ManageClubs";
import ManagerDashboard from "../Pages/Dashboard/ClubManager/ManagerDashboard";
import ClubCreate from "../Component/Registration/ClubCreate";
import ClubSignUp from "../Component/Registration/ClubSignUp";
import ClubmangerSignUp from "../Component/Registration/ClubmangerSignUp";
import PendingClubs from "../Pages/Dashboard/Admin/PendingClubs";
import PendingClubManagers from "../Pages/Dashboard/Admin/PendingClubManagers";
import ApprovedClubManagers from '../Pages/Dashboard/Admin/ApprovedClubManagers';
import PendingEvents from '../Pages/Dashboard/Admin/PendingEvents';
import ApprovedEvents from '../Pages/Dashboard/Admin/ApprovedEvents';
import ManageUsers from "../Pages/Dashboard/Admin/ManageUsers";
import ApprovedClubs from "../Pages/Dashboard/Admin/ApprovedClubs";
import ApprovedMembers from "../Pages/Dashboard/ClubManager/ApprovedMembers";
import PendingMembers from "../Pages/Dashboard/ClubManager/PendingMembers";
import Clubs from "../Pages/Clubs/Clubs";
import Events from "../Pages/Events/Events";
import CreateEvent from "../Component/Registration/EventRegistration/EventCreate";
import EventDetails from "../Pages/Events/EventDetails";
import AdminDashboard from "../Pages/Dashboard/Admin/AdminDashboard";
import ErrorPage from "../Pages/Shared/ErrorPage";
import Pricing from "../Pages/Shared/Pricing";
export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    errorElement: <ErrorPage />,
    children: [
      { index: true, Component: Home },
      {
        path: "club/:id",
        element: (
          <PrivateRoute>
            <ClubDetails />
          </PrivateRoute>
        )
      }, {
        path: "join-club",
        element: (
          <PrivateRoute>
            <ClubSignUp />
          </PrivateRoute>
        ),
      },

      {
        path: "clubs",
        Component: Clubs
      },
      {
        path: "events",
        Component: Events
      },
      {
        path: "event/:id",
        Component: EventDetails
      },

      {
        path: "payment/club-fee",
        element: (
          <PrivateRoute>
            <PaymentClubsFee />
          </PrivateRoute>
        ),
      },

      {
        path: "payment/event-fee",
        element: (
          <PrivateRoute>
            <PaymentEventFee />
          </PrivateRoute>
        ),
      },
      {
        path: "clubmangerregister",
        element: (
          <PrivateRoute>
            <ClubmangerSignUp />
          </PrivateRoute>
        ),
      },
   
      { path: "login", Component: Signin },
      { path: "register", Component: Signup },
      { path: "pricing", Component: Pricing },
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
      { path: "overview", Component: MemberOverview },
      { path: "my-clubs", Component: MyClubs },
      { path: "my-events", Component: MyEvents },
      { path: "payment-history", Component: PaymentHistory },
      { path: "profile", Component: MemberProfile },

      // Club Manager Routes
      {
        path: "manage-clubs",
        element: (
          <ManagerRoute>
            <ManageClubs />
          </ManagerRoute>
        )
      },
      {
        path: "club-manager/:id",
        element: (
          <ManagerRoute>
            <ManagerDashboard />
          </ManagerRoute>
        )
      },
      {
        path: "approved-members",
        element: (
          <ManagerRoute>
            <ApprovedMembers />
          </ManagerRoute>
        )
      },
      {
        path: "pending-members",
        element: (
          <ManagerRoute>
            <PendingMembers />
          </ManagerRoute>
        )
      },
      {
        path: "create-event",
        element: (
          <ManagerRoute>
            <CreateEvent />
          </ManagerRoute>
        )
      },      {
        path: "clubcreate",
        element: (
          <ManagerRoute>
            <ClubCreate />
          </ManagerRoute>
        ),
      },

      // Admin Routes
      {
        path: "pending-clubs",
        element: (
          <AdminRoute>
            <PendingClubs />
          </AdminRoute>
        )
      },
      {
        path: "pending-clubmanagers",
        element: (
          <AdminRoute>
            <PendingClubManagers />
          </AdminRoute>
        )
      },
      {
        path: "approved-clubmanagers",
        element: (
          <AdminRoute>
            <ApprovedClubManagers />
          </AdminRoute>
        )
      },
      {
        path: "approved-clubs",
        element: (
          <AdminRoute>
            <ApprovedClubs />
          </AdminRoute>
        )
      },
      {
        path: "approved-events",
        element: (
          <AdminRoute>
            <ApprovedEvents />
          </AdminRoute>
        )
      },
      {
        path: "pending-events",
        element: (
          <AdminRoute>
            <PendingEvents />
          </AdminRoute>
        )
      },
      {
        path: "admin-dashboard",
        element: (
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        )
      },
      {
        path: "manage-users",
        element: (
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        )
      },
      // Redirect or default
      { path: "mydashboard", Component: MemberOverview }, // Legacy/alias
      { index: true, Component: MemberOverview },
    ],
  },
]);
