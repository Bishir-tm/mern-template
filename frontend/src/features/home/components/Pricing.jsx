import React from "react";

const PricingSection = () => {
  return (
    <div className="bg-base-100 py-12 " id="pricing">
      <h2 className="text-3xl font-bold text-center mb-6">Our Pricing</h2>
      <div className="flex flex-wrap justify-center gap-6">
        <div className="card w-80 bg-base-200 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Airtime</h3>
            <p>As low as ₦50 per transaction</p>
          </div>
        </div>
        <div className="card w-80 bg-base-200 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Data Bundles</h3>
            <p>Starting from ₦100 for 500MB</p>
          </div>
        </div>
        <div className="card w-80 bg-base-200 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Bill Payments</h3>
            <p>Utility payments at no extra cost!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
