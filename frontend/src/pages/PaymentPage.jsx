import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { makePayment } from '../features/payments/paymentsSlice';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.payments);
  const { user } = useSelector((state) => state.auth);
  const { sessionId, tutor, selectedTime, selectedDuration, subject, total, userData } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState('credit_card');

  const isSignupPayment = !!userData; // If userData exists, this is a signup payment

  if (isSignupPayment) {
    if (!userData) {
      return (
        <div className="p-6 text-center text-red-600 font-semibold">
          Missing user data. Please start the registration process again.
        </div>
      );
    }
  } else {
    if (!sessionId || !tutor || !selectedTime || !selectedDuration || !subject || !total) {
      return (
        <div className="p-6 text-center text-red-600 font-semibold">
          Missing booking details. Please return to the booking page.
        </div>
      );
    }
    if (!user) {
      return (
        <div className="p-6 text-center text-red-600 font-semibold">
          You must be logged in to make a payment.
        </div>
      );
    }
  }

  const handlePayment = async () => {
    try {
      if (isSignupPayment) {
        const paymentData = {
          userData,
          paymentMethod,
          paymentAmount: 50,
        };
        const result = await dispatch(makePayment({ ...paymentData, isSignup: true })).unwrap();
        navigate('/login', {
          state: { message: 'Payment processed successfully! Please log in.' },
        });
      } else {
        const paymentData = {
          sessionId,
          tutorId: tutor._id,
          studentId: user._id,
          amount: total,
          paymentMethod,
        };
        const result = await dispatch(makePayment({ ...paymentData, isSignup: false })).unwrap();
        navigate('/sessions', {
          state: { message: 'Payment processed successfully! Your session is confirmed.' },
        });
      }
    } catch (err) {
      console.error('Error processing payment:', err);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        {isSignupPayment ? 'Complete Your Registration' : 'Payment Summary'}
      </h1>

      <div className="bg-white shadow-lg rounded-lg p-6 space-y-4">
        {isSignupPayment ? (
          <div className="text-center">
            <h2 className="text-xl font-semibold mt-2">Welcome, {userData.name}!</h2>
            <p className="text-gray-500 text-sm">Please pay the initial fee of 50 ETB to activate your account.</p>
          </div>
        ) : (
          <div className="text-center">
            <img
              src={tutor.avatarUrl || 'https://images.pexels.com/photos/4218883/pexels-photo-4218883.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'}
              alt={tutor.name}
              className="w-20 h-20 mx-auto rounded-full object-cover"
            />
            <h2 className="text-xl font-semibold mt-2">{tutor.name}</h2>
            <p className="text-gray-500 text-sm">{tutor.subjects?.join(', ') || 'N/A'}</p>
          </div>
        )}

        <div className="border-t pt-4 space-y-2 text-sm text-gray-700">
          {isSignupPayment ? (
            <p className="text-lg font-semibold text-gray-800">
              <strong>Total:</strong> 50 ETB
            </p>
          ) : (
            <>
              <p><strong>Subject:</strong> {subject}</p>
              <p><strong>Selected Time:</strong> {selectedTime}</p>
              <p><strong>Duration:</strong> {selectedDuration} hour{selectedDuration > 1 ? 's' : ''}</p>
              <p><strong>Rate:</strong> {tutor.pricePerHour} ETB/hr</p>
              <p className="text-lg font-semibold text-gray-800">
                <strong>Total:</strong> {total} ETB
              </p>
            </>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="credit_card">Credit Card</option>
            <option value="paypal">PayPal</option>
            <option value="bank_transfer">Bank Transfer</option>
          </select>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
            {error || 'Failed to process payment'}
          </div>
        )}

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full py-2 px-4 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg transition disabled:opacity-50"
        >
          {loading ? 'Processing...' : `Pay ${isSignupPayment ? '50' : total} ETB`}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;