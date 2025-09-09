import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import CloseIcon from '@mui/icons-material/Close';
import React,{useState, useEffect, } from 'react';
import ReactDOM from 'react-dom';
import { getAuthHeaders } from '../utils/auth';
import { useUser } from '../utils/UserContext';
import ConfirmationModal from './ConfirmationModal';

const  Subscriptions = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [windowForm,setWindowForm] = useState({description:"", amount:"", currency:"USD", reminder:""});
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editForm, setEditForm] = useState({description:"", amount:"", currency:"USD", reminder:""});
    const [billEdit, setBillEdit] = useState(null);
    const [bills, setBills] = useState([]); 
    const { user, addNotification } = useUser();
    const [errorMessage, setErrorMessage] = useState("");
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmModalMessage, setConfirmModalMessage] = useState('');
    const [onConfirmAction, setOnConfirmAction] = useState(null);
    const [billToDeleteId, setBillToDeleteId] = useState(null);

    const today = new Date();
    const minDate = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
    const maxDate = new Date(today.getFullYear() + 10, 11, 31).toISOString().split('T')[0];

    const handleChange = (e) => {
      const { name, value } = e.target;
      setWindowForm(prev => ({
          ...prev,
          [name]: value
      }));
  };
  const handleEditChange = (e) => {
      const { name, value } = e.target;
      setEditForm(prev => ({
          ...prev,
          [name]: value
      }));
  };
  

  const handleSubmit = async (e) => {
      e.preventDefault();
      setConfirmModalMessage('Are you sure you want to add this subscription?');
      setOnConfirmAction(() => async () => {
        await executeAddSubscription(windowForm);
        if (!errorMessage) {
          await fetchBills();
          setIsFormOpen(false);
          setWindowForm({description:"", amount:"", currency:"USD", reminder:""});
        }
        setShowConfirmModal(false); 
      });
      setShowConfirmModal(true);
  };
  const handleEditSubmit = async (e) => {
      e.preventDefault();
      setConfirmModalMessage('Are you sure you want to save changes to this subscription?');
      setOnConfirmAction(() => async () => {
        await executeEditBill(billEdit._id, {
            description: editForm.description,
            amount: editForm.amount,
            currency: editForm.currency,
            remindertime: new Date(editForm.reminder).toISOString()
        });
      });
      setShowConfirmModal(true);
  };
  const openEditModal = (bill) => {
        setBillEdit(bill);
        setEditForm({
            description: bill.description,
            amount: bill.amount,
            currency: bill.currency,
            reminder: new Date(bill.remindertime).toISOString().split('T')[0] 
        });
        setIsEditOpen(true);
    };
 const executeAddSubscription = async (formData) => {
    if (user.subscriptionPlan === 'free' && bills.length >= 5) {
        setErrorMessage('You have reached the maximum number of subscriptions for the free plan. Please upgrade to premium to add more.');
        return;
    }
      try {
          const response = await fetch('http://localhost:3000/bill', {
              method: 'POST',
              headers: getAuthHeaders(),
              body: JSON.stringify({
                  description: formData.description,
                  amount: parseFloat(formData.amount),
                  currency: formData.currency,
                  remindertime: new Date(formData.reminder).toISOString()
              })
          });

          if (!response.ok) {
            throw new Error('Failed to add subscription');
          }

          const bill = await response.json();
          addNotification('Subscription added successfully');
          console.log('Bill created:', bill);
      } catch (error) {
          addNotification(error.message);
          console.error('Error creating bill:', error);
      }
  };

  const fetchBills = async () => {
      try {
          const response = await fetch('http://localhost:3000/bill/me', {
              headers: getAuthHeaders()
          });
          if (!response.ok) {
            throw new Error('Failed to fetch subscriptions');
          }
          const data = await response.json();
          setBills(Array.isArray(data) ? data : []);
      } catch (error) {
          addNotification(error.message);
          console.error('Error fetching bills:', error);
      }
  };

  useEffect(() => {
      fetchBills();
  }, []);

  const executeDeleteBill = async(billId)=>{
    try{
        const response = await fetch(`http://localhost:3000/bill/${billId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (!response.ok) {
            throw new Error('Failed to delete subscription');
        }
        setBills(bills.filter(bill => bill._id !== billId));
        addNotification('Subscription deleted successfully');
    }catch(error){
        addNotification(error.message);
        console.error('Error deleting bill:', error);
    } finally {
        setShowConfirmModal(false); 
        setBillToDeleteId(null); 
    }
  }

  const deleteBill = (billId) => {
    setConfirmModalMessage('Are you sure you want to delete this subscription? This action cannot be undone.');
    setOnConfirmAction(() => () => executeDeleteBill(billId));
    setBillToDeleteId(billId); 
    setShowConfirmModal(true);
  };
  

  const executeEditBill = async(billId, updatedData)=>{

    try {
        const response = await fetch(`http://localhost:3000/bill/${billId}`, { // <-- Changed URL
            method: 'PUT', 
            headers: getAuthHeaders(),
            body: JSON.stringify({
                description: updatedData.description,
                amount: parseFloat(updatedData.amount),
                currency: updatedData.currency,
                remindertime: updatedData.remindertime
            })
        });
        if (!response.ok) {
            throw new Error('Failed to edit subscription');
        }
        const bill = await response.json();
        setBills(prevBills => prevBills.map(b => (b._id === bill._id ? bill : b)));
        addNotification('Subscription updated successfully');
        console.log('Bill updated:', bill);
    } catch (error) {
        addNotification(error.message);
        console.error('Error updating bill:', error);
    } finally {
        setShowConfirmModal(false); 
        setIsEditOpen(false); 
        setEditForm({description:"", amount:"", currency:"USD", reminder:""}); // Reset edit form
        fetchBills(); 
    }
}

    const handleExportCsv = async () => {
        try {
            const response = await fetch('http://localhost:3000/export/subscriptions', {
                headers: getAuthHeaders()
            });
            if (!response.ok) {
                throw new Error('Failed to export subscriptions');
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'subscriptions.csv';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            addNotification('Subscriptions exported successfully');
        } catch (error) {
            addNotification(error.message);
            console.error('Error exporting subscriptions:', error);
        }
    };

    return (
        
        <div className = "subscription-container">
            <button className ="add-subscription" onClick={() => setIsFormOpen(true)}>+ Add a Subscription</button>
            <button className ="export-csv" onClick={handleExportCsv}>Export Subscriptions to CSV</button>
            {!isFormOpen && (
  bills.length === 0 ? (
    <div className="subscription-empty-body">
        <Inventory2OutlinedIcon />
        <div className="subscription-empty-message">You don't have any subscriptions yet.</div>
    </div>
  ) : (
    <div className="bills-list">
        {bills.map(bill => (
            <div key={bill._id} className="bill-item">
                <button className="delete-button" onClick={() => deleteBill(bill._id)}><CloseIcon/></button>
                <h3>{bill.description}</h3>
                <p>Amt: <span className="bill-amount-currency">{bill.amount} {bill.currency}</span></p>
                <p>Reminder: {new Date(bill.remindertime).toLocaleDateString()}</p>
                <button className="edit-button" onClick={() => openEditModal(bill)}>Edit</button>
            </div>
        ))}
    </div>
  )
)}

            {isFormOpen &&
  ReactDOM.createPortal(
    <div className="modal-root">
      <form className="subscription-form-card" onSubmit={handleSubmit}>
          <h2 className="subscription-form-title">Add a new subscription</h2>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <button className="close-button" type="button" onClick={()=> {setIsFormOpen(false); setErrorMessage("");}}>
            <CloseIcon />
          </button>
          <input 
            type="text" 
            name="description" 
            placeholder="Description" 
            required 
            onChange={handleChange} 
            value={windowForm.description}
          />
          <div className="form-amount-currency-group">
            <input 
              type="number" 
              name="amount" 
              placeholder="Amount" 
              required 
              onChange={handleChange} 
              value={windowForm.amount}
              min="0"
              step="0.01"
            />
            <select 
              name="currency" 
              required 
              onChange={handleChange} 
              value={windowForm.currency}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="JPY">JPY</option>
              <option value="CAD">CAD</option>
              <option value="AUD">AUD</option>
              <option value="CHF">CHF</option>
              <option value="CNY">CNY</option>
              <option value="SEK">SEK</option>
              <option value="NZD">NZD</option>
            </select>
          </div>
          <input 
            type="date" 
            name="reminder" 
            placeholder="Reminder" 
            required 
            onChange={handleChange} 
            value={windowForm.reminder}
            min={minDate}
            max={maxDate}
          />
          <button type="submit">Submit</button>
      </form>
    </div>,
    document.body
  )
}
            {isEditOpen &&
    ReactDOM.createPortal(
        <div className="modal-root">
            <form className="subscription-form-card" onSubmit={handleEditSubmit}>
                <h2 className="subscription-form-title">Edit Subscription</h2>
                <button className="close-button" type="button" onClick={() => setIsEditOpen(false)}>
                    <CloseIcon />
                </button>
                <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    required
                    onChange={handleEditChange}
                    value={editForm.description}
                />
                <div className="form-amount-currency-group">
                    <input
                        type="number"
                        name="amount"
                        placeholder="Amount"
                        required
                        onChange={handleEditChange}
                        value={editForm.amount}
                        min="0"
                        step="0.01"
                    />
                    <select
                        name="currency"
                        required
                        onChange={handleEditChange}
                        value={editForm.currency}
                    >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="JPY">JPY</option>
                        <option value="CAD">CAD</option>
                        <option value="AUD">AUD</option>
                        <option value="CHF">CHF</option>
                        <option value="CNY">CNY</option>
                        <option value="SEK">SEK</option>
                        <option value="NZD">NZD</option>
                    </select>
                </div>
                <input
                    type="date"
                    name="reminder"
                    placeholder="Reminder"
                    required
                    onChange={handleEditChange}
                    value={editForm.reminder}
                    min={minDate}
                    max={maxDate}
                />
                <button type="submit">Submit</button>
            </form>
        </div>,
        document.body
    )
}
            <ConfirmationModal
                message={confirmModalMessage}
                onConfirm={onConfirmAction}
                onCancel={() => setShowConfirmModal(false)}
                isVisible={showConfirmModal}
            />
        </div>
    );
};

export default Subscriptions;