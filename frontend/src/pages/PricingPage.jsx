import React from 'react';

export const PricingPage = () => {
  return (
    <div className="max-w-3xl mx-auto py-16 px-6 space-y-10">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-secondary-900">Transparent & Flexible Pricing</h1>
        <p className="text-secondary-600 mt-4 max-w-2xl mx-auto">
          Tutors on MDAF set their own hourly rates based on their experience and subject expertise. Students can use filters to compare and find tutors that best match their goals and budget.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 space-y-5 border border-gray-200">
        <div>
          <h2 className="text-xl font-semibold text-secondary-800">Students</h2>
          <p className="text-secondary-700 mt-1">
            Browse available tutors, compare hourly rates, and filter by price to find a match that fits your learning goals. No hidden fees — you only pay the hourly rate listed by the tutor.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-secondary-800">Tutors</h2>
          <p className="text-secondary-700 mt-1">
            You are free to set your own rate based on your qualifications, experience, and teaching style. EduConnect deducts a small 10% platform fee from each session payment to support operations and secure payment handling.
          </p>
        </div>

        <div className="bg-primary-50 text-primary-800 border-l-4 border-primary-500 p-4 rounded-md">
          <p className="text-sm">
            Example: If you set your rate to <strong>ETB 40/hr</strong>, MDAF will take <strong>ETB 4</strong> as a platform fee and you receive <strong>ETB 36</strong> per session.
          </p>
        </div>

        <p className="text-sm text-secondary-500">
          Payments are processed securely. You can track your earnings and session history in your dashboard.
        </p>
      </div>
    </div>
  );
};

  export default PricingPage;