import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md text-gray-800">
      <h1 className="text-3xl font-bold text-center mb-4">Privacy Policy for MDAF Online Tutor Platform</h1>
      <p className="text-center text-gray-500 mb-6">Effective Date: May 3, 2025</p>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Introduction</h2>
        <p className="text-gray-600">
          This Privacy Policy explains how MDAF Online Tutor ("we," "us," or "our") collects, uses, discloses, and protects your personal information when you use our website at mdafonlinetutor.com or associated mobile applications. We are committed to safeguarding your privacy and ensuring compliance with applicable data protection laws.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Information We Collect</h2>
        <p className="text-gray-600">
          We collect the following types of information:
        </p>
        <ul className="list-disc list-inside text-gray-600 mt-2">
          <li><strong>Personal Information:</strong> Name, email address, gender, academic level, and payment details (e.g., credit card information) provided during signup and booking.</li>
          <li><strong>Tutor-Specific Information:</strong> Credentials, availability (e.g., Mondays, 9 AM to 12 PM), subjects taught (e.g., Mathematics, Physics), and profile photos.</li>
          <li><strong>Usage Data:</strong> Session logs, IP addresses, device information, and browsing activity to improve user experience.</li>
          <li><strong>Feedback and Communication:</strong> Reviews, ratings, and messages exchanged between students and tutors via the platform.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">How We Use Your Information</h2>
        <p className="text-gray-600">
          We use your information for the following purposes:
        </p>
        <ul className="list-disc list-inside text-gray-600 mt-2">
          <li>Facilitate tutor-student matching and session scheduling.</li>
          <li>Process payments, including the 30% platform fee, and issue refunds (with a 10% processing fee if within 48 hours).</li>
          <li>Enhance platform functionality through analytics (e.g., tracking popular subjects like Computer Science).</li>
          <li>Communicate updates, session reminders, and promotional offers (opt-out available).</li>
          <li>Ensure compliance with our terms, including user conduct monitoring.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">How We Share Your Information</h2>
        <p className="text-gray-600">
          We share your information as follows:
        </p>
        <ul className="list-disc list-inside text-gray-600 mt-2">
          <li><strong>With Tutors/Students:</strong> Sharing student academic levels or tutor availability to facilitate sessions.</li>
          <li><strong>Service Providers:</strong> Payment processors (e.g., for credit card transactions) and hosting services, under strict confidentiality agreements.</li>
          <li><strong>Legal Requirements:</strong> If required by law or to protect our rights (e.g., in case of misconduct investigations).</li>
        </ul>
        <p className="text-gray-600 mt-2">
          We do not sell your personal information to third parties.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Data Security</h2>
        <p className="text-gray-600">
          We implement industry-standard measures to protect your data, including encryption for payment details and secure storage for user profiles. However, no system is entirely secure, and we cannot guarantee absolute security.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Your Rights</h2>
        <p className="text-gray-600">
          You have the right to:
        </p>
        <ul className="list-disc list-inside text-gray-600 mt-2">
          <li>Access, update, or delete your personal information via your account settings.</li>
          <li>Opt out of promotional emails by clicking "unsubscribe" in email footers.</li>
          <li>Request data portability or raise concerns by contacting support@mdafonlinetutor.com.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Cookies and Tracking</h2>
        <p className="text-gray-600">
          We use cookies to enhance user experience (e.g., remembering login sessions) and track usage patterns. You can manage cookie preferences through your browser settings, but disabling cookies may limit platform functionality.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Data Retention</h2>
        <p className="text-gray-600">
          We retain personal information for as long as your account is active or as needed to provide services (e.g., session history for feedback). Inactive accounts are deleted after 2 years, and payment data is retained for 7 years for legal compliance.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Children's Privacy</h2>
        <p className="text-gray-600">
          Our platform is not intended for users under 13 years old. If we learn that we have collected data from a child under 13 without parental consent, we will delete it promptly.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Changes to This Policy</h2>
        <p className="text-gray-600">
          We may update this Privacy Policy periodically. Changes will be posted on this page, and significant updates will be communicated via email or platform notifications.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Contact Information</h2>
        <p className="text-gray-600">
          For privacy-related inquiries, contact us at <a href="mailto:support@mdafonlinetutor.com" className="text-blue-600 hover:underline">support@mdafonlinetutor.com</a> or [Your Physical Address].
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;