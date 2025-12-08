import React, { useState } from "react";
import { Outlet, NavLink, Link } from "react-router-dom";

export default function DashBoardLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);

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
                        d="M3 10h18M7 15h1m4 0h1M6 5h12a3 3 0 013 3v8a3 3 0 01-3 3H6a3 3 0 01-3-3V8a3 3 0 013-3z" />
                </svg>
                {!isCollapsed && <span>Payment History</span>}
              </NavLink>
            </li>

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
