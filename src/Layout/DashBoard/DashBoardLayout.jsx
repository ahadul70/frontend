import React, { useState } from "react";
import { Outlet, NavLink, Link } from "react-router-dom";
import useAuth from "../../Context/useAuth";

export default function DashBoardLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { role } = useAuth();

  return (
    <div className="drawer lg:drawer-open min-h-screen">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      {/* MAIN CONTENT */}
      <div className="drawer-content flex flex-col">

        {/* NAVBAR (Mobile Only) */}
        <nav className="navbar w-full bg-base-300 lg:hidden">
          <label
            htmlFor="dashboard-drawer"
            aria-label="open sidebar"
            className="btn btn-square btn-ghost"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </label>

          <div className="text-xl font-bold px-4">ClubSphere Dashboard</div>
        </nav>

        {/* PAGE CONTENT */}
        <main className="flex-1 bg-base-200 p-4 min-h-full">
          <Outlet />
        </main>
      </div>

      {/* SIDEBAR */}
      <div className="drawer-side z-20">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>

        <div
          className={`flex min-h-full flex-col items-start bg-base-100 transition-all duration-300 
            ${isCollapsed ? "w-16" : "w-72"}`}
        >
          <ul className="menu w-full p-4">

            {/* SIDEBAR HEADER */}
            <li className="mb-4 flex items-center justify-between">
              <Link
                to="/"
                className={`text-xl font-bold p-2 ${isCollapsed ? "w-full text-center" : ""}`}
              >
                {isCollapsed ? "CS" : "ClubSphere"}
              </Link>

              {/* collapse button */}
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="btn btn-circle btn-ghost btn-sm hidden lg:flex"
              >
                {!isCollapsed ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            </li>

            {/* MENU ITEMS */}
            <li>
              <NavLink
                to="/dashboard/overview"
                className={isCollapsed ? "tooltip tooltip-right" : ""}
                data-tip="Overview"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m7-7l7 7M5 10v10h3m10-11l2 2v10h-3m-6 0v-4h4v4" />
                </svg>
                {!isCollapsed && <span>Overview</span>}
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/dashboard/my-clubs"
                className={isCollapsed ? "tooltip tooltip-right" : ""}
                data-tip="My Clubs"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2a5 5 0 00-9.288 0M7 20H2v-2a3 3 0 015.356-1.857" />
                </svg>
                {!isCollapsed && <span>My Clubs</span>}
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/dashboard/my-events"
                className={isCollapsed ? "tooltip tooltip-right" : ""}
                data-tip="My Events"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14V7H5v14z" />
                </svg>
                {!isCollapsed && <span>My Events</span>}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/payment-history"
                className={isCollapsed ? "tooltip tooltip-right" : ""}
                data-tip="Payment History"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14V7H5v14z" />
                </svg>
                {!isCollapsed && <span>Payment History</span>}
              </NavLink>
            </li>
            {/* ADMIN LINKS */}
            {role === 'super_admin' && (
              <>
                <li>
                  <NavLink
                    to="/dashboard/pending-clubs"
                    className={isCollapsed ? "tooltip tooltip-right" : ""}
                    data-tip="Pending Clubs"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {!isCollapsed && <span>Pending Clubs</span>}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/approved-clubs"
                    className={isCollapsed ? "tooltip tooltip-right" : ""}
                    data-tip="Approved Clubs"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {!isCollapsed && <span>Approved Clubs</span>}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/pending-clubmanagers"
                    className={isCollapsed ? "tooltip tooltip-right" : ""}
                    data-tip="Pending Club Managers"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    {!isCollapsed && <span>Pending Club Managers</span>}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/approved-clubmanagers"
                    className={isCollapsed ? "tooltip tooltip-right" : ""}
                    data-tip="Approved Club Managers"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0c0 .667.333 1 1 1v1a1 1 0 102 0v-1c.667 0 1-.333 1-1" />
                    </svg>
                    {!isCollapsed && <span>Approved Club Managers</span>}
                  </NavLink>
                </li>
              </>
            )}

            {/* MANAGER LINKS */}
            {role === 'club_manager' && (
              <>
                <li>
                  <NavLink
                    to="/dashboard/approved-members"
                    className={isCollapsed ? "tooltip tooltip-right" : ""}
                    data-tip="Approved Members"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    {!isCollapsed && <span>Approved Members</span>}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/pending-members"
                    className={isCollapsed ? "tooltip tooltip-right" : ""}
                    data-tip="Pending Members"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {!isCollapsed && <span>Pending Members</span>}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/manage-clubs"
                    className={isCollapsed ? "tooltip tooltip-right" : ""}
                    data-tip="Club Manager"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {!isCollapsed && <span>Manage Clubs</span>}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/create-event"
                    className={isCollapsed ? "tooltip tooltip-right" : ""}
                    data-tip="Create Event"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {!isCollapsed && <span>Create Event</span>}
                  </NavLink>
                </li>            <li>
              <NavLink
                to="/dashboard/pending-events"
                className={isCollapsed ? "tooltip tooltip-right" : ""}
                data-tip="Pending Events"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {!isCollapsed && <span>Pending Events</span>}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/approved-events"
                className={isCollapsed ? "tooltip tooltip-right" : ""}
                data-tip="Approved Events"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {!isCollapsed && <span>Approved Events</span>}
              </NavLink>
            </li>
              </>
            )}


  
            {/* Divider */}
            <div className="divider"></div>

            {/* Back Home */}
            <li>
              <Link
                to="/"
                className={isCollapsed ? "tooltip tooltip-right" : ""}
                data-tip="Home"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M3 12l9-9 9 9v10H5a2 2 0 01-2-2V12z" />
                </svg>
                {!isCollapsed && <span>Home</span>}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
