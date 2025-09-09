import { useState, useEffect } from 'react';

const Billing = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:3000/billing', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch invoices');
                }

                const data = await response.json();
                setInvoices(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchInvoices();
    }, []);

    if (loading) {
        return <div>Loading invoices...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="billing">
            <h2 className="billing-title">Billing History</h2>
            {invoices.length === 0 ? (
                <p>No invoices found.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Invoice</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map((invoice) => (
                            <tr key={invoice.id}>
                                <td>{new Date(invoice.created * 1000).toLocaleDateString()}</td>
                                <td>${(invoice.amount_paid / 100).toFixed(2)}</td>
                                <td>{invoice.status}</td>
                                <td>
                                    <a href={invoice.invoice_pdf} target="_blank" rel="noopener noreferrer">
                                        View PDF
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Billing;
