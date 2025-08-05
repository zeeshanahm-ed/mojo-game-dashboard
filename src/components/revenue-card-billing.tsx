interface InvoiceCardProps {
  label: string;
  amount: number;
  count: number;
  backgroundColor: string;
  labelColor: string;
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
      <div className="w-1/2 text-right text-2xl ">
        <p className="">{count}</p>
        <p className="text-light-gray text-sm ">Count</p>
      </div>
    </div>
  </div>
);

function RevenueCardBilling({ invoices }: any) {

  const cardData = [
    {
      label: 'Sent',
      amount: invoices?.sentInvoicesTotal || 0,
      count: invoices?.sentInvoicesCount || 0,
      backgroundColor: '#EFF8F8',
      labelColor: '#297889',
    },
    {
      label: 'Paid',
      amount: invoices?.paidInvoicesTotal || 0,
      count: invoices?.paidInvoicesCount || 0,
      backgroundColor: '#F1F8EF',
      labelColor: '#5F8929',
    },
    {
      label: 'Unpaid',
      amount: invoices?.unpaidInvoicesTotal || 0,
      count: invoices?.unpaidInvoicesCount || 0,
      backgroundColor: '#F8F5EF',
      labelColor: '#897F29',
    },
    {
      label: 'Cancelled',
      amount: invoices?.cancelledInvoicesTotal || 0,
      count: invoices?.cancelledInvoicesCount || 0,
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
}

export default RevenueCardBilling;
