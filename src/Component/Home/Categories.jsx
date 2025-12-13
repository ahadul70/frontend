import React from 'react';
import { motion } from 'framer-motion';

const Categories = () => {
    const categories = [
        "Photography", "Sports", "Tech", "Music", "Arts", "Fitness", "Gaming", "Business"
    ];

    return (
        <section className="py-20 bg-base-100">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Popular Categories</h2>
                    <p className="text-gray-500">Find a club that matches your passion.</p>
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                    {categories.map((cat, index) => (
                        <motion.div
                            key={cat}
                            className="bg-base-200 px-8 py-4 rounded-full font-semibold cursor-pointer hover:bg-primary hover:text-white transition-colors duration-300 shadow-sm"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            {cat}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Categories;
