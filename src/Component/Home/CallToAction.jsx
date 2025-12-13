import React from 'react';
import { Link } from 'react-router-dom';

const CallToAction = () => {
    return (
        <section className="py-24 bg-primary text-white text-center">
            <div className="container mx-auto px-4 max-w-4xl">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">Start Your Club Journey Today</h2>
                <p className="text-xl mb-10 opacity-90">
                    Join thousands of members discovering new passions everyday. Create your own club or join an existing one.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/auth/registration" className="btn btn-lg bg-white text-primary hover:bg-gray-100 border-none">
                        Get Started for Free
                    </Link>
                    <Link to="/clubs" className="btn btn-lg btn-outline text-white hover:bg-white hover:text-primary">
                        Browse All Clubs
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default CallToAction;
