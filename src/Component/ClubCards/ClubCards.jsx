import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import useAxiosSecurity from '../../Context/useAxiosSecurity';
const ClubsCards = () => {
    const axiosInstance = useAxiosSecurity();
    const [clubs, setClubs] = useState([]);

    useEffect(() => {
        const fetchClubs = async () => {
            try {
                const response = await axiosInstance.get('/clubs');
                setClubs(response.data);
            } catch (error) {
                console.error("Error fetching clubs:", error);
            }
        };
        fetchClubs();
    }, [axiosInstance]);

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold text-center mb-10">All Clubs</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clubs.map((club) => (
                    <Link to={`/club/${club._id}`} key={club._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer">
                        <figure>
                            {club.bannerImage ? (
                                <img src={club.bannerImage} alt={club.clubName} className="h-48 w-full object-cover" />
                            ) : (
                                <img src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp" alt="Club" className="h-48 w-full object-cover" />
                            )}
                        </figure>
                        <div className="card-body">
                            <h2 className="card-title">
                                {club.clubName}
                                <div className="badge badge-secondary">{club.category}</div>
                            </h2>
                            <p>{club.description}</p>
                            <div className="card-actions justify-end mt-4">
                                {club.membershipFee > 0 ? (
                                    <div className="badge badge-outline">Fee: ${club.membershipFee}</div>
                                ) : (
                                    <div className="badge badge-outline">Free</div>
                                )}
                                <div className="badge badge-outline">{club.location}</div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default ClubsCards