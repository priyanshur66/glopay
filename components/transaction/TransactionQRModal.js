import Modal from "../Modal";
import {
  createQR,
  encodeURL,
  findReference,
  validateTransfer,
  FindReferenceError,
  ValidateTransferError,
} from "@solana/pay";
import { PublicKey, Keypair } from "@solana/web3.js";
import BigNumber from "bignumber.js";
import { useConnection } from "@solana/wallet-adapter-react";
import { useEffect, useRef, useState } from "react";
import { truncate } from "../../utils/string";
import { useCashApp } from "../../hooks/cashapp";
import { getAvatarUrl } from "../../functions/getAvatarUrl";

const TransactionQRModal = ({
  modalOpen,
  setModalOpen,
  userAddress,
  setQrCode,
}) => {
  const { transactions, setTransactions } = useCashApp();
  const qrRef = useRef();
  const { connection } = useConnection();

  // State to hold the user input for the amount
  const [amountInput, setAmountInput] = useState();
  const [generateQR, setGenerateQR] = useState(false);

  const handleAmountChange = (e) => {
    // Update the amountInput state when the user changes the amount
    setAmountInput(e.target.value);

    // Disable automatic QR code generation
    setGenerateQR(false);
  };
  const loadQr = () => {
    // Enable QR code generation when the "Load QR code" button is pressed
    setGenerateQR(true);
  };

  useEffect(() => {
    if (generateQR) {
      const recipient = new PublicKey(userAddress);
      const amount = new BigNumber(amountInput);

      const reference = Keypair.generate().publicKey;
      const label = "Payment for purchase";
      const message = "Thanks for sol";

      const urlParams = {
        recipient,
        amount,
        reference,
        label,
        message,
      };

      const url = encodeURL(urlParams);
      const qr = createQR(url, 488, "transparent");

      if (qrRef.current) {
        qrRef.current.innerHtml = "";
        qr.append(qrRef.current);
      }

      const interval = setInterval(async () => {
        console.log("Waiting for transaction conformation");
        try {
          const signatureInfo = await findReference(connection, reference, {
            finality: "confirmed",
          });
          console.log("validating");
          await validateTransfer(
            connection,
            signatureInfo.signature,
            {
              recipient,
              amount,
              reference,
            },
            { commitment: "confirmed" }
          );
          // storage

          const newID = (transactions.Length + 1).toString();
          const newTransaction = {
            id: newID,
            from: {
              name: recipient,
              handle: recipient,
              avatar: getAvatarUrl(recipient.toString()),
              verified: true,
            },
            to: {
              name: reference,
              handle: "-",
              avatar: getAvatarUrl(reference.toString()),
              verified: false,
            },
            desciption: "sent through mobile",
            transactionDate: new Date(),
            status: "completed",
            amount: amount,
            source: "-",
          };

          setTransactions([newTransaction, ...transactions]);
          setModalOpen(false);
          clearInterval(interval);
        } catch (e) {
          if (e instanceof FindReferenceError) {
            // no transaction found yet
            return;
          }
          if (e instanceof ValidateTransferError) {
            console.error("Transaction is invalid", e);
            return;
          }
          console.error("unknown error ", e);
        }
      }, 500);

      return () => clearInterval(interval);
    }
  }, [generateQR, amountInput, userAddress]);

  return (
    <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
      <div>
        <div className="flex flex-col items-center justify-center space-y-1">
          <div ref={qrRef} />
        </div>

        <div className="flex flex-col items-center justify-center space-y-1">
          <p className="text-lg font-medium text-gray-800">XYZ retail</p>

          <p className="text-sm font-light text-gray-600">
            To pay ${truncate(userAddress)}
          </p>

          {/* Input field for user to enter the amount */}
          <input
            type="text"
            value={amountInput}
            onChange={handleAmountChange}
            className="w-1/2 rounded-lg bg-gray-100 py-3 text-center focus:outline-none"
            placeholder="Amount"
          />

          <button
            onClick={loadQr}
            className="w-full rounded-lg bg-[#B378FF] py-3 hover:bg-opacity-70"
          >
            <span className="font-medium text-white">Load QR code</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default TransactionQRModal;
