import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import CloseIcon from '@mui/icons-material/Close';
import React,{useState, useEffect, } from 'react';
import ReactDOM from 'react-dom';
import { getAuthHeaders } from '../utils/auth';

const  Subscriptions = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [windowForm,setWindowForm] = useState({description:"", reminder:""});
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editForm, setEditForm] = useState({reminder:""});
    const [billEdit, setBillEdit] = useState(null);
    const [bills, setBills] = useState([]); 

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
      await addSubscription(windowForm);
      await fetchBills(); 
      setIsFormOpen(false);
      setWindowForm({description:"", reminder:""});
  };
  const handleEditSubmit = async (e) => {
      e.preventDefault();
      await editBill(billEdit._id, {
          reminderTime: new Date(editForm.reminder).toISOString()
      });
      await fetchBills();
      setIsEditOpen(false);
      setEditForm({reminder:""});
  };
  const openEditModal = (bill) => {
        setBillEdit(bill);
        setEditForm({
            description: bill.description,
            reminder: new Date(bill.remindertime).toISOString().split('T')[0] 
        });
        setIsEditOpen(true);
    };
 const addSubscription = async (formData) => {
      try {
          const response = await fetch('http://localhost:3000/bill', {
              method: 'POST',
              headers: getAuthHeaders(),
              body: JSON.stringify({
                  description: formData.description,
                  remindertime: new Date(formData.reminder).toISOString()
              })
          });

          const bill = await response.json();
          console.log('Bill created:', bill);
      } catch (error) {
          console.error('Error creating bill:', error);
      }
  };

  const fetchBills = async () => {
      try {
          const response = await fetch('http://localhost:3000/bill/me', {
              headers: getAuthHeaders()
          });
          const data = await response.json();
          setBills(Array.isArray(data) ? data : []);
      } catch (error) {
          console.error('Error fetching bills:', error);
      }
  };

  useEffect(() => {
      fetchBills();
  }, []);

  const deleteBill = async(billId)=>{
    try{
        await fetch(`http://localhost:3000/bill/${billId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        setBills(bills.filter(bill => bill._id !== billId));
    }catch(error){
        console.error('Error deleting bill:', error);
    }
  }
  

  const editBill = async(billId, updatedData)=>{

    try {
        const response = await fetch(`http://localhost:3000/bill`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                id: billId,
                remindertime: updatedData.reminderTime
            })
        });
        const bill = await response.json();
        console.log('Bill updated:', bill);
    } catch (error) {
        console.error('Error updating bill:', error);
    }
}

    return (
        
        <div className = "subscription-container">
            <button className ="add-subscription" onClick={() => setIsFormOpen(true)}>+ Add a Subscription</button>
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
          <button className="close-button" type="button" onClick={()=>setIsFormOpen(false)}>
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
          <input 
            type="date" 
            name="reminder" 
            placeholder="Reminder" 
            required 
            onChange={handleChange} 
            value={windowForm.reminder}
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
                    type="date"
                    name="reminder"
                    placeholder="Reminder"
                    required
                    onChange={handleEditChange}
                    value={editForm.reminder}
                />
                <button type="submit">Submit</button>
            </form>
        </div>,
        document.body
    )
}
</div>
    );
};

export default Subscriptions;