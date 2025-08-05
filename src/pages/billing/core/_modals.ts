 interface Invoice {
    // Define the structure of a single invoice object
    id: string;
    // Add more fields as needed for the invoice data
  }
  export interface InvoicesData {
    currentPage: number;
    data: Invoice[];
    error: string | null;
    isSuccess: boolean;
    message: string;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  }
  export interface BillingData {
    cancelledInvoices: number;
    paidInvoices: number;
    sentInvoices: number;
    unpaidInvoices: number;
    invoices: InvoicesData; 
  }
  export interface BillingDataParams {
    limit: number;        
    page: number; 
   
    status: any;
    startDate: string| Date | null;
    endDate: string | Date | null;
    invoiceNumber: any;
}