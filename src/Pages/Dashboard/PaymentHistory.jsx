import React from 'react';
import useAuth from '../../Context/useAuth';
import useAxiosSecurity from '../../Context/useAxiosSecurity';
import { useQuery } from '@tanstack/react-query';

const PaymentHistory = () => {
    const { user } = useAuth();
    const axiosInstance = useAxiosSecurity();

    const { data: allClubs = [] } = useQuery({
        queryKey: ['clubs'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/clubs');
            return data;
        }
    });

    const { data: payments = [], isLoading } = useQuery({
        queryKey: ['payments', user?.email],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/payments?email=${user?.email}`);
            return data;
        },
        enabled: !!user?.email
    });

    if (isLoading) return <div>Loading payments...</div>;

    const history = payments.map(pay => {
        const club = allClubs.find(c => c._id === pay.clubId);
        return { ...pay, club };
    });

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-6">Payment History</h2>
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center py-4">No payment history found.</td>
                            </tr>
                        ) : (
                            history.map((pay) => (
                                <tr key={pay._id}>
                                    <td>
                                        {new Date(pay.createdAt || pay.date).toLocaleDateString()}
                                    </td>
                                    <td>
                                        {pay.type === 'membership'
                                            ? `Membership Fee - ${pay.club?.clubName || 'Unknown Club'}`
                                            : pay.type}
                                    </td>
                                    <td className="font-mono">
                                        ${pay.amount}
                                    </td>
                                    <td>
                                        <div className="badge badge-success badge-outline">
                                            {pay.status || 'Completed'}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PaymentHistory;
