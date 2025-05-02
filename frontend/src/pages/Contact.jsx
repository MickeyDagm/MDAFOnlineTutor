import { useState } from "react";
// import { Instagram, Linkedin, Send, PhoneCall } from "lucide-react";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState({});
  const [success, setSuccess] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError({});
    setSuccess("");

    const errors = {};
    const nameRegex = /^[a-zA-Z]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!firstName || !nameRegex.test(firstName)) {
      errors.firstName = "First name is required and must contain only letters.";
    }
    if (!lastName || !nameRegex.test(lastName)) {
      errors.lastName = "Last name is required and must contain only letters.";
    }
    if (!email || !emailRegex.test(email)) {
      errors.email = "A valid email is required.";
    }
    if (!phone) {
      errors.phone = "Phone number is required.";
    }
    if (!message) {
      errors.message = "Message is required.";
    } else if (message.split(" ").length > 500) {
      errors.message = "Message exceeds 500-word limit.";
    }

    if (Object.keys(errors).length > 0) {
      setError(errors);
      return;
    }

    const templateParams = {
      from_email: email,
      to_name: "Dagmawi Ephrem",
      firstName,
      lastName,
      phone,
      message,
    };

    emailjs
      .send("service_oqxbeqa", "template_4jtgh5s", templateParams, "YScyqLRJxdFCfROZQ")
      .then(() => {
        setSuccess("Message sent successfully!");
        setEmail("");
        setMessage("");
        setFirstName("");
        setLastName("");
        setPhone("");
      })
      .catch(() => {
        setError({ global: "Failed to send message. Please try again." });
      });
  };

  return (
    <section className="bg-white py-16 px-4" id="contact">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-5xl font-bold text-center">Contact Us</h2>
        <form onSubmit={handleSubmit} className="mt-10 grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <input
              type="text"
              name="fname"
              placeholder="First Name"
              className="w-full p-3 rounded-lg border border-teal-400 bg-black/10 focus:outline-teal-600"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            {error.firstName && <p className="text-red-600 text-sm">{error.firstName}</p>}

            <input
              type="text"
              name="lname"
              placeholder="Last Name"
              className="w-full p-3 rounded-lg border border-teal-400 bg-black/10 focus:outline-teal-600"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            {error.lastName && <p className="text-red-600 text-sm">{error.lastName}</p>}

            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full p-3 rounded-lg border border-teal-400 bg-black/10 focus:outline-teal-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error.email && <p className="text-red-600 text-sm">{error.email}</p>}

            <input
              type="tel"
              name="tel"
              placeholder="Phone Number"
              className="w-full p-3 rounded-lg border border-teal-400 bg-black/10 focus:outline-teal-600"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {error.phone && <p className="text-red-600 text-sm">{error.phone}</p>}
          </div>

          <div className="space-y-4">
            <textarea
              name="message"
              rows="10"
              placeholder="Enter Your Message (max 500 words)"
              className="w-full p-3 rounded-lg border border-teal-400 bg-black/10 focus:outline-teal-600"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            {error.message && <p className="text-red-600 text-sm">{error.message}</p>}

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-teal-700 text-white hover:bg-teal-800 transition"
            >
              Submit
            </button>

            {error.global && <p className="text-red-600 text-sm">{error.global}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}
          </div>
        </form>
      </div>
    </section>
  );
};

const SocialButton = ({ href, icon, gradient }) => (
  <a href={href} target="_blank" rel="noreferrer">
    <button className="w-12 h-12 rounded-full relative overflow-hidden dark:bg-gray-950 bg-white shadow-md group">
      <div className="z-10 relative text-xl text-gray-700 dark:text-white">{icon}</div>
      <div
        className={`absolute top-full left-0 w-full h-full rounded-full ${gradient} z-0 transition-all duration-500 group-hover:top-0`}
      ></div>
    </button>
  </a>
);

export default Contact;
