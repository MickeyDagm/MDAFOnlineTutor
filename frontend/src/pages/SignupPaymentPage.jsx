import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { makePayment } from '../features/payments/paymentsSlice';

const SignupPaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.payments);
  const { userData } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState('credit_card');

  // Validation for missing user data
  if (!userData) {
    return (
      <div className="p-6 text-center text-red-600 font-semibold">
        Missing user data. Please start the registration process again.
      </div>
    );
  }

  const handlePayment = async () => {
    try {
      const paymentData = {
        userData,
        paymentMethod,
        paymentAmount: 50,
      };
      const result = await dispatch(makePayment({ ...paymentData, isSignup: true })).unwrap();
      navigate('/login', {
        state: { message: 'Payment processed successfully! Please log in.' },
      });
    } catch (err) {
      console.error('Error processing payment:', err);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Complete Your Registration
      </h1>

      <div className="bg-white shadow-lg rounded-lg p-6 space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold mt-2">Welcome, {userData.name}!</h2>
          <p className="text-gray-500 text-sm">
            Please pay the initial fee of 50 ETB to activate your account.
          </p>
        </div>

        <div className="border-t pt-4 space-y-2 text-sm text-gray-700">
          <p className="text-lg font-semibold text-gray-800">
            <strong>Total:</strong> 50 ETB
          </p>
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
          {loading ? 'Processing...' : 'Pay 50 ETB'}
        </button>
      </div>
    </div>
  );
};

export default SignupPaymentPage;