import React, { useState, useEffect } from 'react';
import { FileText, Download, RefreshCw, AlertCircle, Receipt } from 'lucide-react';
import { useAuth } from './authcontext';
import supabase from '../config/superbaseClient';
import '../styles/Invoicelist.css'; // Import the CSS file
import '../styles/Docs.css';


export default function InvoiceList() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInvoices = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Fetch invoices directly from Supabase
      const { data, error: fetchError } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (fetchError) throw fetchError;
      
      setInvoices(data || []);
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError('Failed to load invoices. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
    
    // Set up real-time subscription to receive updates
    const invoicesSubscription = supabase
      .channel('public:invoices')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'invoices',
          filter: `user_id=eq.${user?.id}` 
        }, 
        (payload) => {
          console.log('Change received!', payload);
          fetchInvoices();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(invoicesSubscription);
    };
  }, [user]);

  const handleViewFile = (invoice) => {
    if (invoice.file_url) {
      window.open(invoice.file_url, '_blank');
    } else {
      alert('No file available for this invoice');
    }
  };

  const handleDownloadFile = async (invoice) => {
    if (!invoice.file_url) {
      alert('No file available to download');
      return;
    }
    
    try {
      // Extract the filename from the URL
      const urlParts = invoice.file_url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      
      // Download the file directly
      const { data, error } = await supabase.storage
        .from('invoices')
        .download(`${user.id}/${fileName}`);
        
      if (error) throw error;
      
      // Create a download link
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to download file. Please try again.');
    }
  };

  // Format currency amount
  const formatCurrency = (amount) => {
    if (!amount) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(amount));
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading invoices...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-header">
          <AlertCircle className="error-icon" />
          <h3>Error Loading Invoices</h3>
        </div>
        <p>{error}</p>
        <button onClick={fetchInvoices} className="retry-button">
          <RefreshCw className="button-icon" />
          Retry
        </button>
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="empty-state">
        <Receipt className="empty-icon" />
        <h2>No invoices found</h2>
        <p>Upload an invoice to get started with tracking your finances.</p>
        <button className="upload-button">Upload Invoice</button>
      </div>
    );
  }

  return (
    <div className="invoice-list">
      <button className="back-button" onClick={() => window.history.back()}>Back</button>
      <div className="invoice-header">
        <h2><Receipt className="header-icon" /> Your Invoices</h2>
      </div>
    <div className="invoice-container">
      
      
      <div className="table-wrapper">
        <table className="invoice-table">
          <thead>
            <tr>
              <th>Invoice Number</th>
              <th>Vendor</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice, index) => (
              <tr key={invoice.id || index}>
                <td className="invoice-number">{invoice.invoice_number || 'N/A'}</td>
                <td>{invoice.vendor || 'N/A'}</td>
                <td>{formatDate(invoice.date)}</td>
                <td className="invoice-amount">{formatCurrency(invoice.amount)}</td>
                <td className="actions-cell">
                  {invoice.file_url ? (
                    <div className="action-buttons">
                      <button 
                        onClick={() => handleViewFile(invoice)}
                        className="view-button"
                      >
                        <FileText className="button-icon" />
                        View
                      </button>
                      
                      <button 
                        onClick={() => handleDownloadFile(invoice)}
                        className="download-button"
                      >
                        <Download className="button-icon" />
                        Download
                      </button>
                    </div>
                  ) : (
                    <span className="no-file">No file</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="invoice-footer">
        <p className="invoice-count">
          Showing {invoices.length} invoice{invoices.length !== 1 ? 's' : ''}
        </p>
        <button 
          onClick={fetchInvoices}
          className="refresh-button"
        >
          <RefreshCw className="button-icon" />
          Refresh
        </button>
      </div>
    </div>
    </div>
  );
}