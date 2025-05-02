import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { CheckCircle } from 'lucide-react';

export default function BecomeTutorPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-teal-100 to-white py-16 px-6 text-center">
        <h1 className="text-4xl font-bold text-black mb-4">Teach on MDAF</h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Join our growing community of tutors and make a difference. Teach what you love, on your own schedule, and earn money sharing your skills.
        </p>
        <Link to="/signup">
          <Button className="mt-6 px-6 py-3 text-lg bg-teal-700 hover:bg-teal-800">Start Teaching</Button>
        </Link>
      </div>

      {/* Why Become a Tutor */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-semibold text-black">Why become a tutor on MDAF?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: 'Flexible Schedule',
              desc: 'Set your own availability and teach when it works best for you.',
            },
            {
              title: 'Your Own Price',
              desc: 'Decide how much to charge per hour based on your skills and demand.',
            },
            {
              title: 'Teach What You Know',
              desc: 'From math to music — list subjects that match your strengths.',
            },
          ].map((item, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow border">
              <CheckCircle className="text-teal-600 w-6 h-6 mb-3" />
              <h3 className="text-lg font-bold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-semibold text-black">How it works</h2>
        </div>
        <div className="max-w-4xl mx-auto space-y-8">
          {[
            {
              step: '1. Create a Profile',
              desc: 'Sign up and share your experience, subjects, and availability.',
            },
            {
              step: '2. Get Discovered by Students',
              desc: 'Your profile will appear in student searches based on filters like subject, language, and price.',
            },
            {
              step: '3. Start Teaching',
              desc: 'Manage your sessions, receive payments, and track your impact.',
            },
          ].map((item, index) => (
            <div key={index} className="flex flex-col md:flex-row md:items-start md:gap-4">
              <div className="text-teal-600 text-lg font-bold">{item.step}</div>
              <div className="text-gray-700 text-sm mt-1 md:mt-0">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <div className="text-center py-16 bg-gradient-to-br from-teal-100 to-white px-6">
        <h2 className="text-2xl font-semibold text-black mb-4">Ready to get started?</h2>
        <p className="text-gray-700 mb-6">Create your tutor profile today and begin earning on your own terms.</p>
        <Link to="/signup">
          <Button className="px-6 py-3 text-lg bg-teal-700 hover:bg-teal-800">Join as a Tutor</Button>
        </Link>
      </div>
    </div>
  );
}
