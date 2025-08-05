export const status= {
    COMPLETED : 0,
    PENDING :1,
    IN_PROGRESS : 2,
    CANCELLED : 3,
}

export const statusTextMap = {
    [status.COMPLETED]: "Completed",
    [status.PENDING]: "Pending",
    [status.IN_PROGRESS]: "In Progress",
    [status.CANCELLED]: "Cancelled",
};
export const statusColors = {
  [status.COMPLETED]: "#3C6D1E", 
  [status.PENDING]: "#F6C61E",   
  [status.IN_PROGRESS]: "#5BA8EE", 
  [status.CANCELLED]: "#851015", 
};

export const invoiceStatus= {
  PAID:0,
  CANCELLED:1,
  UNPAID:2,
  SENT:3
}

export const statusInvoiceMap = {
  [invoiceStatus.PAID]: "Paid",
  [invoiceStatus.CANCELLED]: "Cancelled",
  [invoiceStatus.UNPAID]: "Unpaid",
  [invoiceStatus.SENT]: "Sent",
};
export const statusColorMap = {
  [invoiceStatus.PAID]: "#5F8929",
  [invoiceStatus.CANCELLED]: "#892929",
  [invoiceStatus.UNPAID]: "#897F29",
  [invoiceStatus.SENT]: "#297889",
};

export const CASES_STATUS_OF_SUPPORTED_EMPLOYMENT = {
 VAL_1: 0,
  VAL2: 1,
  VAL_3: 2,
  VAL_4: 3,
  VAL_5 : 4
}

export const CASES_STATUS_OF_JOB_PLACEMENT = {
 FORTY_DAYS: 0,
  NINETY_DAYS: 1,
}

