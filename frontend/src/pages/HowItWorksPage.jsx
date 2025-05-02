
import React from 'react';

export const HowItWorksPage = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-10">
      <h1 className="text-3xl font-bold text-secondary-900 text-center">How MDAF Works</h1>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-secondary-800">1. Sign Up</h2>
        <p className="text-secondary-700">
          Whether you're a student or a tutor, create your free account in just a few minutes. Students can customize their profile with learning goals, academic level, and subject preferences. Tutors provide their qualifications, experience, and availability.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-secondary-800">2. Find or Become a Tutor</h2>
        <p className="text-secondary-700">
          Students can browse and filter a wide range of tutor profiles based on price, subject, experience, language, and rating. Tutors can list their services and be matched with students based on their profile.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-secondary-800">3. Book and Learn</h2>
        <p className="text-secondary-700">
          Once you've found a match, you can schedule sessions based on your availability. Sessions are conducted online through the EduConnect platform.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-secondary-800">4. Track Progress</h2>
        <p className="text-secondary-700">
          Both students and tutors can view session history, leave reviews, and track learning outcomes through the dashboard.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-secondary-800">5. Secure Payment</h2>
        <p className="text-secondary-700">
          Payments are handled securely on the platform. EduConnect takes a small platform fee (10%) from the tutor side per session.
        </p>
      </section>
    </div>
  );
};

 export default HowItWorksPage;
