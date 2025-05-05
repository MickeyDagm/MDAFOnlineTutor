import React from 'react';

const CookiePolicy = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md text-gray-800">
      <h1 className="text-3xl font-bold text-center mb-4">Cookie Policy for MDAF Online Tutor Platform</h1>
      <p className="text-center text-gray-500 mb-6">Effective Date: May 3, 2025</p>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Introduction</h2>
        <p className="text-gray-600">
          This Cookie Policy explains how MDAF Online Tutor ("we," "us," or "our") uses cookies and similar technologies on our website at mdafonlinetutor.com and associated mobile applications. By using our platform, you consent to the use of cookies as described below.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">What Are Cookies?</h2>
        <p className="text-gray-600">
          Cookies are small text files stored on your device that help us enhance your experience by remembering your preferences, tracking usage, and improving platform functionality. Similar technologies include web beacons, pixels, and local storage.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Types of Cookies We Use</h2>
        <p className="text-gray-600">
          We use the following types of cookies:
        </p>
        <ul className="list-disc list-inside text-gray-600 mt-2">
          <li><strong>Essential Cookies:</strong> Necessary for basic platform functionality (e.g., user authentication, session management).</li>
          <li><strong>Performance Cookies:</strong> Collect anonymous data on how users interact with the platform (e.g., popular subjects like Mathematics) to optimize performance.</li>
          <li><strong>Functional Cookies:</strong> Remember your preferences (e.g., language settings, tutor availability filters) to personalize your experience.</li>
          <li><strong>Advertising Cookies:</strong> Enable targeted ads based on your browsing behavior, with opt-out options available.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">How We Use Cookies</h2>
        <p className="text-gray-600">
          We use cookies to:
        </p>
        <ul className="list-disc list-inside text-gray-600 mt-2">
          <li>Enable login sessions and secure payment processing (including the 30% platform fee).</li>
          <li>Analyze usage patterns to improve tutor-student matching and session scheduling.</li>
          <li>Deliver personalized content and recommendations based on your activity.</li>
          <li>Support marketing efforts, ensuring relevant promotions reach you (opt-out available via email preferences).</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Managing Cookies</h2>
        <p className="text-gray-600">
          You can manage cookies through your browser settings:
        </p>
        <ul className="list-disc list-inside text-gray-600 mt-2">
          <li>Enable or disable cookies via your browser’s privacy settings.</li>
          <li>Delete existing cookies to reset tracking preferences.</li>
          <li>Note that disabling essential cookies may limit platform functionality (e.g., inability to book sessions).</li>
        </ul>
        <p className="text-gray-600 mt-2">
          For more control, you can opt out of advertising cookies by adjusting preferences in your account settings or contacting support@mdafonlinetutor.com.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Third-Party Cookies</h2>
        <p className="text-gray-600">
          We may allow third-party services (e.g., payment processors, analytics providers) to set cookies. These parties are bound by their own privacy policies, and we do not control their data practices.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Cookie Duration</h2>
        <p className="text-gray-600">
          Cookies are stored for varying periods:
        </p>
        <ul className="list-disc list-inside text-gray-600 mt-2">
          <li>Session Cookies: Deleted when you close your browser.</li>
          <li>Persistent Cookies: Remain for up to 2 years or until you delete them, depending on their purpose (e.g., user preferences).</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Changes to This Policy</h2>
        <p className="text-gray-600">
          We may update this Cookie Policy periodically to reflect changes in technology or regulations. Updates will be posted here, and significant changes will be communicated via email or platform notifications.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Contact Information</h2>
        <p className="text-gray-600">
          For questions about this Cookie Policy, contact us at <a href="mailto:support@mdafonlinetutor.com" className="text-blue-600 hover:underline">support@mdafonlinetutor.com</a> or [Your Physical Address].
        </p>
      </section>
    </div>
  );
};

export default CookiePolicy;