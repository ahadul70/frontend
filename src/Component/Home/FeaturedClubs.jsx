import React from 'react';
import { Link } from 'react-router-dom';
import useAxiosSecurity from '../../Context/useAxiosSecurity';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

const FeaturedClubs = () => {
    const axiosInstance = useAxiosSecurity();

    const { data: clubs = [] } = useQuery({
        queryKey: ['clubs-featured'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/clubs');
            // Mocking "featured" by taking first 6, or you could add a sort/filter
            return data.slice(0, 6); 
        },
    });

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <section className="py-20 bg-base-100">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">Featured Clubs</h2>
                    <p className="text-gray-600">Explore our top-rated communities and find your tribe.</p>
                </div>

                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    {clubs.map((club) => (
                        <motion.div variants={item} key={club._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border border-base-200">
                            <figure className="h-48 overflow-hidden relative">
                                <img
                                    src={club.bannerImage || "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"}
                                    alt={club.clubName}
                                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute top-4 right-4 badge badge-primary font-semibold">
                                    {club.category || "General"}
                                </div>
                            </figure>
                            <div className="card-body">
                                <h3 className="card-title text-xl">
                                    {club.clubName}
                                </h3>
                                <div className="flex items-center text-sm text-gray-500 mb-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    {club.location || "Online"}
                                </div>
                                <p className="text-gray-600 line-clamp-2">{club.description}</p>
                                
                                <div className="card-actions justify-between items-center mt-6 pt-4 border-t border-base-200">
                                    <div className={`badge ${club.membershipFee > 0 ? 'badge-neutral' : 'badge-ghost'} badge-outline`}>
                                        {club.membershipFee > 0 ? `$${club.membershipFee}/mo` : 'Free'}
                                    </div>
                                    <Link to={`/club/${club._id}`} className="btn btn-primary btn-sm btn-outline hover:!text-white">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                <div className="text-center mt-12">
                    <Link to="/clubs" className="btn btn-wide btn-ghost">View All Clubs →</Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturedClubs;
