import { useMemo, useState } from "react";
import TransactionDetailModal from "./TransactionDetailModal";
import TransactionItem from "./TransactionItem";

const TransactionsList = ({ transactions }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTransactionID, setCurrentTransactionID] = useState(null);
  const currentTransaction = useMemo(
    () =>
      transactions.find(
        (transaction) => transaction.id === currentTransactionID
      ),
    [currentTransactionID]
  );

  const toggleTransactionDetailModal = (value, transactionID) => {
    setCurrentTransactionID(transactionID);
    setModalOpen(value);
  };

  return (
    <div>
      <div className="   bg-[#544962] pb-4 pt-10">
        <p className="mx-auto max-w-3xl px-10 text-sm font-medium uppercase text-[#abafb2] xl:px-0">
          Incoming, outgoing transactions <br />(loan repayment& investment returns
          coming soon)
        </p>
      </div>
      <div className="my-6 mx-auto max-w-3xl divide-y divide-gray-100 rounded-3xl bg-[#A980DD] py-4 px-10 xl:px-0">
        {transactions.map(
          ({ id, to, amount, description, transactionDate }) => (
            <TransactionItem
              key={id}
              id={id}
              to={to}
              description={description}
              transactionDate={transactionDate}
              amount={amount}
              toggleTransactionDetailModal={toggleTransactionDetailModal}
            />
          )
        )}

        <TransactionDetailModal
          className="bg-[#A980DD]"
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          currentTransaction={currentTransaction}
        />
      </div>
    </div>
  );
};

export default TransactionsList;
