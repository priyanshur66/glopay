const Action = ({ setModalOpen }) => {
  const onNewTransaction = () => {
    setModalOpen(true);
  };

  return (
    <div>
      <button
        onClick={onNewTransaction}
        className="w-full rounded-lg bg-[#B378FF] py-3 hover:bg-opacity-70"
      >
        <span className="font-medium text-white">Pay 💵</span>
      </button>
    </div>
  );
};

export default Action;
