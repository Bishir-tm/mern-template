import React from "react";

const FeaturesSection = () => {
  return (
    <div className="bg-base-100 py-12" id="why-choose-us">
      <h2 className="text-3xl font-bold text-center mb-6">Why Choose Us?</h2>
      <div className="flex flex-wrap justify-center gap-6">
        <div className="card w-80 bg-base-200 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Instant Top-Up</h3>
            <p>Recharge your phone instantly without any delays.</p>
          </div>
        </div>
        <div className="card w-80 bg-base-200 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Affordable Rates</h3>
            <p>Enjoy competitive prices on airtime, data, and bills.</p>
          </div>
        </div>
        <div className="card w-80 bg-base-200 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Secure Payments</h3>
            <p>All transactions are encrypted for your safety.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
