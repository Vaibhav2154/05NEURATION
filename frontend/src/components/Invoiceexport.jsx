import { useAuth } from "./authcontext";
import '../styles/Docs.css'

export default function InvoiceExport() {
  const { user } = useAuth();

  const downloadInvoices = (format) => {
    const url = `http://localhost:5000/export?user_id=${user.id}&format=${format}`;
    window.open(url, '_blank');
  };

  return (
    <div className="invoice-export-container">
      <button onClick={() => downloadInvoices('excel')} className="export-button">
        Download Excel
      </button>
      <button onClick={() => downloadInvoices('pdf')} className="export-button">
        Download PDF
      </button>
    </div>
  );
}
