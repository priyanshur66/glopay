import { format } from "date-fns";

const TransactionItem = ({
  id,
  to,
  description,
  transactionDate,
  amount,
  toggleTransactionDetailModal,
}) => {
  const onItemClick = () => {
    toggleTransactionDetailModal(true, id);
  };

  return (
    <div
      onClick={onItemClick}
      className="mx-6 grid cursor-pointer grid-cols-8 items-center  rounded-full p-6 hover:bg-[#CFAAFF]"
    >
      <div className="col-span-2 flex items-center space-x-">
        <img
          className="h-8 w-8 rounded-full object-cover"
          src={to.avatar}
          alt=""
        />
        <p className="truncate text-sm text-gray-800">{to.name}</p>
      </div>

      <p className="col-span-4 text-sm text-gray-400">{description}</p>
      <p className="col-span-1 text-sm text-black">
        {format(new Date(transactionDate), "MMM d")}
      </p>
      <p className="col-span-1 text-right text-sm font-medium text-gray-800">
        {amount} SOL
      </p>
    </div>
  );
};

export default TransactionItem;
