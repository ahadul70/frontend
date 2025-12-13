import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero = () => {
    return (
        <div className="hero min-h-[85vh] bg-base-100 relative overflow-hidden">
            {/* Background Pattern */}
             <div className="absolute inset-0 opacity-10 pointer-events-none">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M0 40L40 0H20L0 20M40 40V20L20 40" stroke="currentColor" strokeWidth="2" fill="none"/>
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            <div className="hero-content text-center z-10">
                <div className="max-w-2xl">
                    <motion.h1 
                        className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        Discover and Join Local Clubs
                    </motion.h1>

                    <motion.p 
                        className="py-6 text-xl text-gray-600 mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Connect with people who share your passion. From tech to art, find your community today and start growing together.
                    </motion.p>
                    
                    <motion.div 
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <Link to="/clubs" className="btn btn-primary btn-lg shadow-lg hover:scale-105 transition-transform">Explore Clubs</Link>
                        <Link to="/auth/registration" className="btn btn-outline btn-lg hover:scale-105 transition-transform">Create a Club</Link>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
