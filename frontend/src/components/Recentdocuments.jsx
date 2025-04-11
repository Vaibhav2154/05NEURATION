import React from 'react';
import { FileText, FileCheck, Clock, AlertCircle } from 'lucide-react';
// import Button from './components/ui/button';
import '../styles/RecentDocumentsTable.css';

const documents = [
  {
    id: "doc-1",
    name: "Invoice-20245-03-15.pdf",
    date: "Apr 8, 2025",
    status: "processed",
    type: "Invoice",
    template: "Standard Invoice",
  },
  {
    id: "doc-2",
    name: "Bill-045678.pdf",
    date: "Apr 7, 2025",
    status: "processed",
    type: "Bill",
    template: "Utility Bill",
  },
  {
    id: "doc-3",
    name: "Statement-Apr2025.pdf",
    date: "Apr 6, 2025",
    status: "pending",
    type: "Statement",
    template: "Bank Statement",
  },
  {
    id: "doc-4",
    name: "Receipt-78546.jpg",
    date: "Apr 5, 2025",
    status: "error",
    type: "Receipt",
    template: "Standard Receipt",
  },
];

const statusIcons = {
  processed: FileCheck,
  pending: Clock,
  error: AlertCircle,
}

const statusStyles = {
  processed: "status-processed",
  pending: "status-pending",
  error: "status-error",
};

export default function RecentDocumentsTable() {
  return (
    <div className="card-container">
      <div className="card-header">
        <h2 className="card-title">Recent Documents</h2>
        <Button variant="ghost" size="sm">
          View all
        </Button>
      </div>
      <div className="card-content">
        <table className="documents-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Type</th>
              <th>Template</th>
              <th className="text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => {
              const StatusIcon = statusIcons[doc.status];
              return (
                <tr key={doc.id}>
                  <td className="document-name">
                    <FileText className="document-icon" />
                    <span className="document-filename">{doc.name}</span>
                  </td>
                  <td>{doc.date}</td>
                  <td>{doc.type}</td>
                  <td>{doc.template}</td>
                  <td className="text-right">
                    <div className={`status-badge ${statusStyles[doc.status]}`}>
                      <StatusIcon className="status-icon" />
                      <span className="capitalize">{doc.status}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}