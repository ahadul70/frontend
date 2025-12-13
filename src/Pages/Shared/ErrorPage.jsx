import React from 'react';
import { Link, useRouteError } from 'react-router-dom';

const ErrorPage = () => {
    const error = useRouteError();
    console.error(error);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 text-center px-4">
            <h1 className="text-9xl font-bold text-primary">404</h1>
            <p className="text-2xl font-semibold mt-4">Oops! Page not found.</p>
            <p className="text-gray-500 mt-2 mb-8">
                The page you are looking for doesn't exist or has been moved.
            </p>
            <Link to="/" className="btn btn-primary btn-wide">
                Go Back Home
            </Link>
        </div>
    );
};

export default ErrorPage;
