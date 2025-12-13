import React, { useState } from 'react';
import ClubCards from '../../Component/ClubCards/ClubCards';

const Clubs = () => {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [sort, setSort] = useState('');

    return (
        <div className="pt-8 container mx-auto px-4">
            <h1 className="text-3xl font-bold text-center mb-8">Explore Clubs</h1>
            
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8 bg-base-100 p-4 rounded-xl shadow-sm">
                {/* Search */}
                <div className="form-control w-full md:w-1/3">
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Search clubs..."
                            className="input input-bordered w-full"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    {/* Category Filter */}
                    <select 
                        className="select select-bordered w-full md:w-auto"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        <option value="Technology">Technology</option>
                        <option value="Arts">Arts</option>
                        <option value="Sports">Sports</option>
                        <option value="Business">Business</option>
                        <option value="Science">Science</option>
                    </select>

                    {/* Sort */}
                    <select 
                        className="select select-bordered w-full md:w-auto"
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                    >
                        <option value="">Sort By</option>
                        <option value="createdAt:desc">Newest First</option>
                        <option value="createdAt:asc">Oldest First</option>
                        <option value="membershipFee:asc">Fee: Low to High</option>
                        <option value="membershipFee:desc">Fee: High to Low</option>
                    </select>
                </div>
            </div>

            <ClubCards filters={{ search, category, sort }} />
        </div>
    );
};

export default Clubs;
