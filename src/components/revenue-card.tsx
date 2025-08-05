interface InvoiceCardProps {
  label: string;
  amount: number;
  count: number;
  backgroundColor: string;
  labelColor: string;
}

interface InvoiceData {
  totalAmount: number;
  count: number;
}


const InvoiceCard = ({ label, amount, count, backgroundColor, labelColor }: InvoiceCardProps) => (
  <div style={{ backgroundColor }} className="p-4 rounded-lg h-30">
    <div className="text-xs text-white w-24 text-center rounded-sm py-1" style={{ backgroundColor: labelColor }}>
      {label}
    </div>
    <div className="flex justify-between items-center mt-4 text-2xl font-medium">
      <div className="w-1/2">
        <p className="">${amount}</p>
        <p className="text-light-gray text-sm">Sum</p>
      </div>
      <div className="w-[2px] h-9 bg-[#BABABA] mb-3"></div>
      <div className="w-1/2 text-right">
        <p className="text-2xl">{count}</p>
        <p className="text-light-gray text-sm">Count</p>
      </div>
    </div>
  </div>
);


const RevenueCard = ({ analyticData }: any) => {

  // Function to calculate total amount and count for a given invoice type
  const calculateTotal = (data: Record<string, InvoiceData>, type: 'totalAmount' | 'count' = 'totalAmount') => {
    return Object.values(data).reduce((total, entry) => total + entry[type], 0);
  };

  const cardData: InvoiceCardProps[] = [
    {
      label: 'Sent',
      amount: calculateTotal(analyticData.sentInvoices, 'totalAmount'),
      count: calculateTotal(analyticData.sentInvoices, 'count'),
      backgroundColor: '#EFF8F8',
      labelColor: '#297889',
    },
    {
      label: 'Paid',
      amount: calculateTotal(analyticData.paidInvoices, 'totalAmount'),
      count: calculateTotal(analyticData.paidInvoices, 'count'),
      backgroundColor: '#F1F8EF',
      labelColor: '#5F8929',
    },
    {
      label: 'Unpaid',
      amount: calculateTotal(analyticData.unpaidInvoices, 'totalAmount'),
      count: calculateTotal(analyticData.unpaidInvoices, 'count'),
      backgroundColor: '#F8F5EF',
      labelColor: '#897F29',
    },
    {
      label: 'Cancelled',
      amount: calculateTotal(analyticData.cancelledInvoices, 'totalAmount'),
      count: calculateTotal(analyticData.cancelledInvoices, 'count'),
      backgroundColor: '#F8EFEF',
      labelColor: '#892929',
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 2xl:grid-cols-4 gap-5">
      {cardData.map((card) => (
        <InvoiceCard key={card.label} {...card} />
      ))}
    </div>
  );
};

export default RevenueCard;
