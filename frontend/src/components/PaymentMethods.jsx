import { useState, useEffect } from 'react';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { getAuthHeaders } from '../utils/auth';
import { setAuthData, getAuthToken } from '../utils/auth';
import { useUser } from '../utils/UserContext';
import ConfirmationModal from './ConfirmationModal';

const API_URL = 'http://localhost:3000';
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
const SetupForm = ({ onSetupSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addNotification } = useUser();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { setupIntent, error: confirmError } = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: window.location.href,
        },
        redirect: 'if_required',
      });
  
      if (confirmError) {
        throw new Error(confirmError.message);
      }
  
      if (setupIntent && setupIntent.payment_method) {
        const res = await fetch(`${API_URL}/attach-payment-method`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({ paymentMethodId: setupIntent.payment_method }),
        });
  
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to attach payment method.');
        }
        onSetupSuccess();
      } else {
        throw new Error('Could not get payment method from Stripe.');
      }
    } catch (error) {
      addNotification(error.message);
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="setup-form">
      <h4>Add a New Card</h4>
      <PaymentElement />
      <div className="form-buttons">
        <button type="button" onClick={onCancel} className="cancel-button">Cancel</button>
        <button disabled={isLoading || !stripe || !elements} id="submit" className="stripe-button">
          {isLoading ? 'Saving...' : 'Save Card'}
        </button>
      </div>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </form>
  );
};
const PaymentMethods = () => {
  const [methods, setMethods] = useState([]);
  const [showAddCard, setShowAddCard] = useState(false);
  const [showSubscriptionSection, setShowSubscriptionSection] = useState(false);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user, setUser, addNotification } = useUser();

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionId, setSubscriptionId] = useState(null);
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState(null);
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(false);
  const [cancelingSubscription, setCancelingSubscription] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalMessage, setConfirmModalMessage] = useState('');
  const [onConfirmAction, setOnConfirmAction] = useState(null);

  const fetchPaymentMethods = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/list-payment-methods`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok) {
        setMethods(data);
      } else {
        throw new Error(data.error || 'Failed to fetch payment methods');
      }
    } catch (err) {
      addNotification(err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const checkSubscriptionStatus = async () => {
    setCheckingSubscription(true);
    try {
      const res = await fetch(`${API_URL}/subscription-status`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok) {
        setIsSubscribed(data.isSubscribed);
        setSubscriptionId(data.subscriptionId);
      } else {
        throw new Error(data.error || 'Failed to check subscription status');
      }
    } catch (err) {
      addNotification(err.message);
      setError(err.message);
    } finally {
      setCheckingSubscription(false);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
    checkSubscriptionStatus();
  }, []);

  const handleAddNewClick = async () => {
    setError(null);
    try {
      const res = await fetch(`${API_URL}/create-setup-intent`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok) {
        setClientSecret(data.clientSecret);
        setShowAddCard(true);
      } else { 
        throw new Error(data.error || 'Could not prepare form.'); 
      }
    } catch (err) {
      addNotification(err.message);
      setError(err.message);
    }
  };

  const executeDeletePaymentMethod = async (paymentMethodId) => {
    setError(null);
    try {
      const res = await fetch(`${API_URL}/detach-payment-method`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ paymentMethodId }),
      });
      if (res.ok) {
        fetchPaymentMethods();
        addNotification('Payment method deleted successfully');
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete card.');
      }
    } catch (err) {
      addNotification(err.message);
      setError(err.message);
    } finally {
      setShowConfirmModal(false); 
    }
  };

  const handleDelete = (paymentMethodId) => {
    setConfirmModalMessage('Are you sure you want to delete this payment method? This action cannot be undone.');
    setOnConfirmAction(() => () => executeDeletePaymentMethod(paymentMethodId));
    setShowConfirmModal(true);
  };

  const handleSetupSuccess = () => {
    setShowAddCard(false);
    setClientSecret(null);
    addNotification('Payment method added successfully');
    setTimeout(() => { 
      fetchPaymentMethods();
      checkSubscriptionStatus(); 
    }, 500);
  };

  const executeConfirmSubscription = async () => {
    if (!selectedPaymentMethodId) {
        setSubscriptionError('Please select a payment method.');
        return;
    }

    setSubscribing(true);
    setSubscriptionError(null);
    setSubscriptionSuccess(false);

    try {
        const res = await fetch(`${API_URL}/subscribe-premium`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ paymentMethodId: selectedPaymentMethodId }),
        });
        const data = await res.json();
        if (res.ok) {
            setSubscriptionSuccess(true);
            setTimeout(() => setSubscriptionSuccess(false), 3000);
            setIsSubscribed(true); 
            setSubscriptionId(data.subscription.id); 
            const updatedUser = { ...user, subscriptionPlan: 'premium' };
            setUser(updatedUser); 
            setAuthData(getAuthToken(), updatedUser); 
            addNotification('Subscribed to Premium Plan successfully');
        } else {
            throw new Error(data.error || 'Subscription failed.');
        }
    } catch (err) {
        addNotification(err.message);
        setSubscriptionError(err.message);
    } finally {
        setSubscribing(false);
        setShowConfirmModal(false); 
    }
}

  const handleConfirmSubscription = () => {
    setConfirmModalMessage('Are you sure you want to subscribe to the Premium Plan?');
    setOnConfirmAction(() => executeConfirmSubscription);
    setShowConfirmModal(true);
  };

  const executeCancelSubscription = async () => {
    if (!subscriptionId) {
      setSubscriptionError('No active subscription to cancel.');
      return;
    }

    setCancelingSubscription(true);
    setSubscriptionError(null);
    setCancelSuccess(false);

    try {
      const res = await fetch(`${API_URL}/cancel-subscription`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ subscriptionId }),
      });
      const data = await res.json();

      if (res.ok) {
        setCancelSuccess(true);
        setTimeout(() => setCancelSuccess(false), 3000);
        setIsSubscribed(false); 
        console.log('isSubscribed after cancellation:', false);
        setSubscriptionId(null);
        const updatedUser = { ...user, subscriptionPlan: 'free' };
        setUser(updatedUser); 
        setAuthData(getAuthToken(), updatedUser); 
        addNotification('Canceled Premium Plan successfully');
      } else {
        throw new Error(data.error || 'Failed to cancel subscription.');
      }
    } catch (err) {
      addNotification(err.message);
      setError(err.message);
    } finally {
      setCancelingSubscription(false);
      setShowConfirmModal(false);
    }
  };

  const handleCancelSubscription = () => {
    setConfirmModalMessage('Are you sure you want to cancel your Premium Plan? This action cannot be undone.');
    setOnConfirmAction(() => executeCancelSubscription);
    setShowConfirmModal(true);
  };

  console.log('isSubscribed in render:', isSubscribed);
  return (
    <div className="payment-methods">
      {error && <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>Error: {error}</div>}

      {loading || checkingSubscription ? (
        <p>Loading payment methods and subscription status...</p>
      ) : showAddCard && clientSecret ? (
        <div className="add-card-container">
          <Elements options={{ clientSecret }} stripe={stripePromise}>
            <SetupForm 
              onSetupSuccess={handleSetupSuccess} 
              onCancel={() => setShowAddCard(false)} 
            />
          </Elements>
        </div>
      ) : showSubscriptionSection ? (
        <div className="subscription-section">
          <h3>Premium Plan</h3>
          {subscriptionError && <div style={{ color: 'red', marginBottom: '1rem' }}>Error: {subscriptionError}</div>}
          {subscriptionSuccess && <div style={{ color: 'green', marginBottom: '1rem' }}>Subscription successful!</div>}
          {cancelSuccess && <div style={{ color: 'green', marginBottom: '1rem' }}>Subscription canceled!</div>}

          {isSubscribed ? (
            <div>
              <p>You are currently subscribed to the Premium Plan.</p>
              <button 
                onClick={handleCancelSubscription} 
                disabled={cancelingSubscription}
                className="payment-action-button"
              >
                {cancelingSubscription ? 'Canceling...' : 'Cancel Pro Plan'}
              </button>
            </div>
          ) : (
            methods.length > 0 ? (
              <div>
                <h4>Select a Payment Method to Subscribe:</h4>
                {methods.map((method) => (
                  <div key={method.id} className="payment-option-card">
                    <input
                      type="radio"
                      id={method.id}
                      name="subscriptionPaymentMethod"
                      value={method.id}
                      checked={selectedPaymentMethodId === method.id}
                      onChange={() => setSelectedPaymentMethodId(method.id)}
                    />
                    <label htmlFor={method.id}>
                      {method.card ? (
                        `${method.card.brand.charAt(0).toUpperCase() + method.card.brand.slice(1)} **** ${method.card.last4} (Expires ${String(method.card.exp_month).padStart(2, '0')}/${method.card.exp_year})`
                      ) : (
                        'PayPal Account'
                      )}
                    </label>
                  </div>
                ))}
                </div>
            ) : (
              <p>No payment methods saved. Please add one first to subscribe.</p>
            )
          )}
          <div className="payment-buttons-row">
            {user.subscriptionPlan !== 'premium' && (
              <button 
                    onClick={handleConfirmSubscription} 
                    disabled={!selectedPaymentMethodId || subscribing}
                    className="payment-action-button"
                  >
                    {subscribing ? 'Subscribing...' : 'Confirm Subscription'}
                  </button>
            )}
            <button onClick={() => setShowSubscriptionSection(false)} className="payment-action-button">Back to Payment Methods</button>
          </div>
        </div>
      ) : (
        <div>
          <ul className="payment-methods-list">
            {methods.length > 0 ? (
              methods.map((method) => (
                <li key={method.id}>
                  <span>{method.card.brand.charAt(0).toUpperCase() + method.card.brand.slice(1)} **** {method.card.last4}</span>
                  <span>Expires {String(method.card.exp_month).padStart(2, '0')}/{method.card.exp_year}</span>
                  <button onClick={() => handleDelete(method.id)} className="delete-button">Delete</button>
                </li>
              ))
            ) : (
              <p>No payment methods saved.</p>
            )}
          </ul>
          <div className="payment-buttons-row">
            <button onClick={handleAddNewClick} className="add-card-button">Add New Card</button>
            <button onClick={() => setShowSubscriptionSection(true)} className="subscribe-button">{user.subscriptionPlan === 'premium' ? 'Manage Subscription' : 'Subscribe to Premium'}</button>
          </div>
        </div>
      )}
    <ConfirmationModal
        message={confirmModalMessage}
        onConfirm={onConfirmAction}
        onCancel={() => setShowConfirmModal(false)}
        isVisible={showConfirmModal}
      />
    </div>
  );
};

export default PaymentMethods;
