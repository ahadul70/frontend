import React from 'react';

const Pricing = () => {
    return (
        <div className="py-20 bg-base-100">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
                <p className="text-lg text-gray-600">Choose the plan that's right for your club.</p>
            </div>

            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Free Plan */}
                <div className="card bg-base-100 shadow-xl border border-gray-200">
                    <div className="card-body">
                        <h2 className="card-title text-2xl">Community</h2>
                        <p className="text-4xl font-bold my-4">$0<span className="text-sm font-normal text-gray-500">/mo</span></p>
                        <p className="text-gray-500 mb-6">Great for small clubs just getting started.</p>
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-center gap-2">✓ Up to 50 members</li>
                            <li className="flex items-center gap-2">✓ Basic event management</li>
                            <li className="flex items-center gap-2">✓ Community support</li>
                        </ul>
                        <button className="btn btn-outline btn-block">Get Started</button>
                    </div>
                </div>

                {/* Pro Plan */}
                <div className="card bg-base-100 shadow-xl border-2 border-primary relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-primary text-white text-xs px-3 py-1 rounded-bl-lg">POPULAR</div>
                    <div className="card-body">
                        <h2 className="card-title text-2xl text-primary">Growth</h2>
                        <p className="text-4xl font-bold my-4">$29<span className="text-sm font-normal text-gray-500">/mo</span></p>
                        <p className="text-gray-500 mb-6">For expanding clubs needing more power.</p>
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-center gap-2">✓ Unlimited members</li>
                            <li className="flex items-center gap-2">✓ Advanced analytics</li>
                            <li className="flex items-center gap-2">✓ Priority support</li>
                            <li className="flex items-center gap-2">✓ Custom branding</li>
                        </ul>
                        <button className="btn btn-primary btn-block">Choose Growth</button>
                    </div>
                </div>

                {/* Enterprise Plan */}
                <div className="card bg-base-100 shadow-xl border border-gray-200">
                    <div className="card-body">
                        <h2 className="card-title text-2xl">Enterprise</h2>
                        <p className="text-4xl font-bold my-4">Custom</p>
                        <p className="text-gray-500 mb-6">Tailored solutions for large organizations.</p>
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-center gap-2">✓ Dedicated account manager</li>
                            <li className="flex items-center gap-2">✓ API access</li>
                            <li className="flex items-center gap-2">✓ SSO & advanced security</li>
                        </ul>
                        <button className="btn btn-outline btn-block">Contact Sales</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pricing;
