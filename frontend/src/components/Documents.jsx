import React, { useState, useEffect } from 'react';
import QuickLRU from '@alloc/quick-lru';
import { useAuth } from './authcontext';
import supabase from '../config/superbaseClient';
import '../styles/Docs.css';

const lruCache = new QuickLRU({ maxSize: 100 });

const Docs = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const fetchInvoices = async (userId) => {
    const cacheKey = `invoices-${userId}`;
    if (lruCache.has(cacheKey)) {
      console.log('Fetching from cache...');
      return lruCache.get(cacheKey);
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) throw error;

      lruCache.set(cacheKey, data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch invoices');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loadInvoices = async () => {
    if (!user?.id) return;
    try {
      const result = await fetchInvoices(user.id);
      setInvoices(result);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (num) => {
    console.log('Trying to delete invoice:', num);
    const { error } = await supabase.from('invoices').delete().eq('num', num);
    if (!error) {
      setInvoices(prev => prev.filter(inv => inv.num !== num));
    } else {
      console.error('Delete error:', error.message);
    }
  };
  
  const handleSave = async (num) => {
    console.log('Saving invoice:', num, editForm);
    const { error } = await supabase.from('invoices').update(editForm).eq('num', num);
    if (!error) {
      window.location.reload(); // 🔄 full page reload
    } else {
      console.error('Save error:', error.message);
    }
    console.log('Saving invoice with num:', num, editForm);

  };
  

  const handleEdit = (inv) => {
    setEditingId(inv.num);
    setEditForm({
      invoice_number: inv.invoice_number,
      vendor: inv.vendor,
      amount: inv.amount,
      tax: inv.tax,
      date: inv.date,
    });
  };
  



  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    loadInvoices();
  }, [user]);

  return (
    <div className="docs-container">
      <button className="back-button" onClick={() => window.history.back()}>Back</button>
      <h1 className="docs-title">My Uploaded Invoices</h1>

      {loading && <p className="docs-message">Loading invoices...</p>}
      {error && <p className="docs-error">Error: {error}</p>}
      {invoices.length > 0 ? (
        <div className="invoice-grid">
          {invoices.map((inv, idx) => (
            <div key={inv.num || idx} className="invoice-card">

              {editingId === inv.num? (
                <div className="invoice-form">
                  <input name="invoice_number" value={editForm.invoice_number} onChange={handleChange} />
                  <input name="vendor" value={editForm.vendor} onChange={handleChange} />
                  <input name="date" value={editForm.date} onChange={handleChange} />
                  <input name="amount" value={editForm.amount} onChange={handleChange} />
                  <input name="tax" value={editForm.tax} onChange={handleChange} />
                  <button onClick={() => handleSave(inv.num)} className="save-btn">Save</button>
                  <button onClick={() => setEditingId(null)} className="cancel-btn">Cancel</button>
                </div>
              ) : (
                <>
                  <div className="invoice-header">
                    <h2 className="invoice-number">Invoice: {inv.invoice_number || 'N/A'}</h2>
                    <p className="invoice-detail">Vendor: {inv.vendor || 'N/A'}</p>
                    <p className="invoice-detail">🗓 Date: {inv.date || 'N/A'}</p>
                  </div>
                  <div className="invoice-footer">
                    <div className="invoice-amount">
                      <p className="label">Amount</p>
                      <p className="value">₹{inv.amount || 0}</p>
                    </div>
                    <div className="invoice-tax">
                      <p className="label">Tax</p>
                      <p className="value">₹{inv.tax || 0}</p>
                    </div>
                  </div>
                  <div className="invoice-actions">
                    <button onClick={() => handleEdit(inv)} className="edit-btn">Edit</button>
                    <button onClick={() => handleDelete(inv.num)} className="delete-btn">Delete</button>

                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        !loading && <p className="docs-message">No invoices found.</p>
      )}
    </div>
  );
};

export default Docs;
