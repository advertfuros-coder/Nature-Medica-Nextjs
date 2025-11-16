import { useState } from 'react';

export function useInvoiceDownload() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const downloadInvoice = async (orderId, source = 'custom') => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/orders/${orderId}/invoice?source=${source}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to download invoice');
      }

      // Check if response is JSON (Shiprocket URL) or PDF blob
      const contentType = response.headers.get('content-type');

      if (contentType?.includes('application/json')) {
        // Shiprocket invoice URL
        const data = await response.json();
        
        if (data.invoiceUrl) {
          // Open Shiprocket invoice in new tab
          window.open(data.invoiceUrl, '_blank');
        }
      } else {
        // Custom PDF invoice
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Invoice-${orderId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }

      setLoading(false);
      return true;

    } catch (err) {
      console.error('Invoice download error:', err);
      setError(err.message);
      setLoading(false);
      return false;
    }
  };

  return { downloadInvoice, loading, error };
}
