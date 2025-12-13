import React from 'react';
import { motion } from 'framer-motion';

const WhyJoin = () => {
    return (
        <section className="py-20 bg-gradient-to-br from-base-200 to-base-300 overflow-hidden">
            <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-12">
                <div className="lg:w-1/2">
                     <motion.img 
                        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80" 
                        alt="Community" 
                        className="rounded-2xl shadow-2xl w-full max-w-lg mx-auto transform -rotate-3 hover:rotate-0 transition-transform duration-500"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                    />
                </div>
                <div className="lg:w-1/2 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="text-4xl font-bold mb-6">Why Join a Club?</h2>
                        <div className="space-y-6">
                            <div className="flex gap-4 items-start">
                                <div className="mt-1 bg-primary/10 p-2 rounded-lg text-primary">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 5.472m0 0a17.995 17.995 0 0 1-3.896-1.125 5.002 5.002 0 0 0 5.05-5.475 5.99 5.99 0 0 1 2.742-17.556m0 0a5.99 5.99 0 0 1 2.742 17.556" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">Community Building</h3>
                                    <p className="text-gray-600">Find your people. Create lasting friendships with individuals who share your interests.</p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-start">
                                <div className="mt-1 bg-primary/10 p-2 rounded-lg text-primary">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">Skill Development</h3>
                                    <p className="text-gray-600">Learn new skills through workshops, events, and peer-to-peer sharing.</p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-start">
                                <div className="mt-1 bg-primary/10 p-2 rounded-lg text-primary">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">Networking & Growth</h3>
                                    <p className="text-gray-600">Expand your professional and personal network in a relaxed environment.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default WhyJoin;
