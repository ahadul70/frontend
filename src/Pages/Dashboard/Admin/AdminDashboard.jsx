import React, { useState, useMemo } from 'react';
import useAxiosSecurity from '../../../Context/useAxiosSecurity';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
    const axiosInstance = useAxiosSecurity();
    const [activeTab, setActiveTab] = useState('stats');

    // 1. Fetch Platform Stats
    const { data: stats = {}, isLoading: statsLoading } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/admin/stats');
            return data;
        }
    });

    // 2. Fetch All Payments (Used for chart and table)
    const { data: payments = [], isLoading: paymentsLoading } = useQuery({
        queryKey: ['admin-payments'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/admin/payments');
            return data;
        }
    });

    // Prepare Chart Data
    const chartData = useMemo(() => {
        if (!payments.length) return [];
        
        // Group by Date (YYYY-MM-DD)
        const grouped = payments.reduce((acc, curr) => {
            const date = new Date(curr.createdAt).toLocaleDateString('en-CA'); // YYYY-MM-DD
            if (!acc[date]) acc[date] = 0;
            acc[date] += parseFloat(curr.amount) || 0;
            return acc;
        }, {});

        // Convert to array and sort by date
        return Object.keys(grouped)
            .sort()
            .slice(-7) // Last 7 days with activity
            .map(date => ({
                date,
                revenue: grouped[date]
            }));
    }, [payments]);


    if (statsLoading || paymentsLoading) return <div className="min-h-screen flex justify-center items-center"><span className="loading loading-spinner loading-lg"></span></div>;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6 text-primary">Platform Administration</h1>

            {/* Tabs */}
            <div role="tablist" className="tabs tabs-boxed mb-6 max-w-md">
                <a role="tab" className={`tab ${activeTab === 'stats' ? 'tab-active' : ''}`} onClick={() => setActiveTab('stats')}>Overview Stats</a>
                <a role="tab" className={`tab ${activeTab === 'payments' ? 'tab-active' : ''}`} onClick={() => setActiveTab('payments')}>Payment Monitor</a>
            </div>

            {/* STATS OVERVIEW */}
            {activeTab === 'stats' && (
                <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="stats shadow bg-base-100 border-l-4 border-primary">
                        <div className="stat">
                            <div className="stat-figure text-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <div className="stat-title">Total Revenue</div>
                            <div className="stat-value text-primary">${(stats.totalRevenue || 0).toFixed(2)}</div>
                            <div className="stat-desc">Platform-wide income</div>
                        </div>
                    </div>

                    <div className="stats shadow bg-base-100 border-l-4 border-secondary">
                        <div className="stat">
                            <div className="stat-figure text-secondary">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                            </div>
                            <div className="stat-title">Total Users</div>
                            <div className="stat-value text-secondary">{stats.totalUsers || 0}</div>
                            <div className="stat-desc">registered accounts</div>
                        </div>
                    </div>

                    <div className="stats shadow bg-base-100 border-l-4 border-accent">
                        <div className="stat">
                            <div className="stat-figure text-accent">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                            </div>
                            <div className="stat-title">Total Clubs</div>
                            <div className="stat-value text-accent">{stats.totalClubs || 0}</div>
                            <div className="stat-desc">active & pending</div>
                        </div>
                    </div>

                    <div className="stats shadow bg-base-100 border-l-4 border-info">
                        <div className="stat">
                            <div className="stat-figure text-info">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            </div>
                            <div className="stat-title">Total Events</div>
                            <div className="stat-value text-info">{stats.totalEvents || 0}</div>
                            <div className="stat-desc">across all clubs</div>
                        </div>
                    </div>
                </div>

                {/* Revenue Chart */}
                <div className="bg-base-100 p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-bold mb-6">Revenue Trends (Orders)</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="revenue" fill="#f43a09" name="Revenue ($)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                        {chartData.length === 0 && <p className="text-center text-gray-500 mt-4">No recent revenue data to display.</p>}
                    </div>
                </div>
                </>
            )}

            {/* PAYMENT MONITOR */}
            {activeTab === 'payments' && (
                <div className="bg-base-100 p-6 rounded-xl shadow-lg mt-4">
                    <h2 className="text-xl font-bold mb-4">All Platform Transactions</h2>
                    {paymentsLoading ? <p>Loading payments...</p> : (
                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <thead>
                                    <tr className="bg-base-200">
                                        <th>Date</th>
                                        <th>User Email</th>
                                        <th>Details (Club/Event)</th>
                                        <th>Amount</th>
                                        <th>Type</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.length === 0 ? (
                                        <tr><td colSpan="6" className="text-center py-4">No transactions found.</td></tr>
                                    ) : (
                                        payments.map((pay) => (
                                            <tr key={pay._id} className="hover">
                                                <td>{new Date(pay.createdAt).toLocaleDateString()} {new Date(pay.createdAt).toLocaleTimeString()}</td>
                                                <td>{pay.userEmail}</td>
                                                <td className="text-sm text-gray-500">
                                                    ID: {pay.clubId || pay.eventId}
                                                </td>
                                                <td className="font-mono font-bold">${parseFloat(pay.amount).toFixed(2)}</td>
                                                <td><span className="badge badge-ghost capitalize">{pay.type}</span></td>
                                                <td><span className="badge badge-success text-white">Completed</span></td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
