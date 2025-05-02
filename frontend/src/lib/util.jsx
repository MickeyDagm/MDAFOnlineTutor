import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility function for conditional classnames
 function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Function to format a number into currency format
const formatCurrency = (amount) => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return 'N/A';
  }
  return `${amount.toFixed(2)} ETB`;
};

// Function to calculate the platform fee (10%)
function calculatePlatformFee(amount) {
  return amount * 0.1; // 10% platform fee
}

// Function to calculate tutor's earnings (90%)
function calculateTutorEarnings(amount) {
  return amount * 0.9; // 90% of the payment goes to tutor
}

// Custom function for time formatting, shows time in relative format (e.g. "2 hours ago")
function formatTimeAgo(date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);  // Ensure date is converted to Date object
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths === 1 ? '' : 's'} ago`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears === 1 ? '' : 's'} ago`;
}

// Example React Component
function PaymentSummary({ amount, paymentDate }) {
  // Ensure paymentDate is a valid Date object
  const paymentDateObj = new Date(paymentDate);

  return (
    <div className="payment-summary">
      <p>Total: {formatCurrency(amount)}</p>
      <p>Platform Fee: {formatCurrency(calculatePlatformFee(amount))}</p>
      <p>Tutor Earnings: {formatCurrency(calculateTutorEarnings(amount))}</p>
      <p>Paid: {formatTimeAgo(paymentDateObj)}</p>
    </div>
  );
}

export { cn, formatCurrency, calculatePlatformFee, calculateTutorEarnings, formatTimeAgo };

