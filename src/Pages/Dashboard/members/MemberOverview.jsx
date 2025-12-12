import React from 'react';
import useAuth from '../../../Context/useAuth';
import useAxiosSecurity from '../../../Context/useAxiosSecurity';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

const MemberOverview = () => {
  const { user } = useAuth();
  const axiosInstance = useAxiosSecurity();

  const { data: memberships = [] } = useQuery({
    queryKey: ['memberships', user?.email],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/memberships?email=${user?.email}`);
      return data;
    },
    enabled: !!user?.email
  });

  const { data: events = [] } = useQuery({
    queryKey: ['events', user?.email],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/event-registrations?email=${user?.email}`);
      return data;
    },
    enabled: !!user?.email
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome Back, {user?.displayName}!</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </div>
            <div className="stat-title">Clubs Joined</div>
            <div className="stat-value text-primary">{memberships.length}</div>
            <div className="stat-desc">Active memberships</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <div className="stat-title">Events Registered</div>
            <div className="stat-value text-secondary">{events.length}</div>
            <div className="stat-desc">Upcoming & Past</div>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Quick Actions</h2>
          <div className="card-actions justify-start">
            <Link to="/clubs" className="btn btn-primary">Browse Clubs</Link>
            <Link to="/dashboard/my-clubs" className="btn btn-outline">View My Memberships</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberOverview;