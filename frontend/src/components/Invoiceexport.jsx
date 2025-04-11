import { useAuth } from "./authcontext";

export default function InvoiceExport() {
  const { user } = useAuth();

  const downloadInvoices = (format) => {
    const url = `http://localhost:5000/export?user_id=${user.id}&format=${format}`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex gap-4">
      <button onClick={() => downloadInvoices('excel')} className="btn">
        Download Excel
      </button>
      <button onClick={() => downloadInvoices('pdf')} className="btn">
        Download PDF
      </button>
    </div>
  );
}
