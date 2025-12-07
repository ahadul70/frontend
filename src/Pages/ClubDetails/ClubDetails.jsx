import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import useAxiosSecurity from '../../Context/useAxiosSecurity';

const ClubDetails = () => {
    const { id } = useParams();
    const axiosInstance = useAxiosSecurity();
    const [club, setClub] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClubDetails = async () => {
            try {
                const response = await axiosInstance.get(`/clubs/${id}`);
                setClub(response.data);
            } catch (error) {
                console.error("Error fetching club details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchClubDetails();
    }, [id, axiosInstance]);

    if (loading) return <div className="text-center py-20">Loading...</div>;
    if (!club) return <div className="text-center py-20">Club not found.</div>;

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="card lg:card-side bg-base-100 shadow-xl">
                <figure className="lg:w-1/2">
                    {club.bannerImage ? (
                        <img src={club.bannerImage} alt={club.clubName} className="w-full h-96 object-cover" />
                    ) : (
                        <img src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp" alt="Club" className="w-full h-96 object-cover" />
                    )}
                </figure>
                <div className="card-body lg:w-1/2">
                    <h2 className="card-title text-4xl mb-4">
                        {club.clubName}
                        <div className="badge badge-secondary text-lg p-3">{club.category}</div>
                    </h2>
                    <p className="flex-grow-0 text-gray-600 mb-4">{club.description}</p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="stat place-items-start p-0">
                            <div className="stat-title">Membership Fee</div>
                            <div className="stat-value text-primary text-2xl">
                                {club.membershipFee > 0 ? `$${club.membershipFee}` : 'Free'}
                            </div>
                        </div>
                        <div className="stat place-items-start p-0">
                            <div className="stat-title">Location</div>
                            <div className="stat-value text-secondary text-lg whitespace-normal">{club.location}</div>
                        </div>
                    </div>

                    <div className="card-actions justify-end mt-auto">
                        <Link to="/" className="btn btn-outline">Back to Clubs</Link>
                        <button className="btn btn-primary">Join Club</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClubDetails;
