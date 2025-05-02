
export const FAQPage = () => {
    const faqs = [
      {
        question: 'How do I sign up as a student or tutor?',
        answer:
          'Simply click on "Sign Up" and choose your role. Fill out the required information and create your free account.',
      },
      {
        question: 'How are tutors verified?',
        answer:
          'Tutors are required to upload credentials, including education level and experience. Our team reviews each profile to ensure quality.',
      },
      {
        question: 'How are payments handled?',
        answer:
          'Payments are made securely through our platform. Tutors receive their earnings after a 10% platform fee is deducted.',
      },
      {
        question: 'Can I request a refund?',
        answer:
          'Refunds may be granted on a case-by-case basis for missed or unsatisfactory sessions. Please contact our support team.',
      },
      {
        question: 'What subjects can I find a tutor for?',
        answer:
          'EduConnect supports a wide range of subjects from primary school to university, including math, science, languages, and more.',
      },
    ];
  
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 space-y-10">
        <h1 className="text-3xl font-bold text-secondary-900 text-center">Frequently Asked Questions</h1>
  
        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
              <h2 className="text-lg font-semibold text-secondary-800">{faq.question}</h2>
              <p className="text-secondary-700 mt-2">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default FAQPage;