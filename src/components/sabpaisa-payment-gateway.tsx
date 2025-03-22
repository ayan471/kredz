"use client";

import { useState, useEffect } from "react";
import { PaymentInitModal } from "pg-test-project";
import { useRouter } from "next/navigation";

interface SabpaisaPaymentGatewayProps {
  clientCode: string;
  transUserName: string;
  transUserPassword: string;
  authkey: string;
  authiv: string;
  payerName: string;
  payerEmail: string;
  payerMobile: string;
  clientTxnId: string;
  amount: string;
  payerAddress: string;
  callbackUrl: string;
  isOpen: boolean;
  onToggle: () => void;
}

function SabpaisaPaymentGateway(props: SabpaisaPaymentGatewayProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [clientCode, setClientCode] = useState(props.clientCode);
  const [transUserName, setTransUserName] = useState(props.transUserName);
  const [transUserPassword, setTransUserPassword] = useState(
    props.transUserPassword
  );
  const [authkey, setAuthkey] = useState(props.authkey);
  const [authiv, setAuthiv] = useState(props.authiv);
  const [payerName, setpayerName] = useState(props.payerName);
  const [payerEmail, setpayerEmail] = useState(props.payerEmail);
  const [payerMobile, setpayerMobile] = useState(props.payerMobile);
  const [clientTxnId, setclientTxnId] = useState(props.clientTxnId);
  const [amount, setamount] = useState(props.amount);
  const [payerAddress, setpayerAddress] = useState(props.payerAddress);
  const [amountType, setamountType] = useState("");
  const [udf12, setudf12] = useState(props.payerEmail || "");
  const [udf13, setudf13] = useState(props.clientTxnId || ""); // Store txnId in udf13 as another backup
  const [udf14, setudf14] = useState("");
  const [udf15, setudf15] = useState("");
  const [udf16, setudf16] = useState("");
  const [udf17, setudf17] = useState("");
  const [channelId, setchannelId] = useState("");
  const [programId, setprogramId] = useState("");
  const [mcc, setmcc] = useState("");

  useEffect(() => {
    console.log("SabpaisaPaymentGateway props:", {
      clientCode: props.clientCode,
      transUserName: props.transUserName,
      isOpen: props.isOpen,
      payerEmail: props.payerEmail, // Log email to verify it's being passed
      clientTxnId: props.clientTxnId,
      callbackUrl: props.callbackUrl,
    });

    setIsOpen(props.isOpen);
    setudf12(props.payerEmail || "");

    // Store txnId in udf13 as another backup
    if (props.clientTxnId) {
      setudf13(props.clientTxnId);
    }
  }, [props]);

  // Handle modal toggle
  const handleToggle = () => {
    setIsOpen(!isOpen);
    props.onToggle();

    // Note: We can't directly detect payment completion here
    // The redirection will be handled by the callback URL
  };

  return (
    <div>
      <PaymentInitModal
        clientCode={clientCode}
        transUserPassword={transUserPassword}
        transUserName={transUserName}
        isOpen={isOpen}
        clientTxnId={clientTxnId}
        authkey={authkey}
        authiv={authiv}
        payerName={payerName}
        payerEmail={payerEmail}
        payerMobile={payerMobile}
        payerAddress={payerAddress}
        amount={amount}
        amountType={amountType}
        udf12={udf12}
        udf13={udf13}
        udf14={udf14}
        udf15={udf15}
        udf16={udf16}
        udf17={udf17}
        onToggle={handleToggle}
        channelId={channelId}
        programId={programId}
        mcc={mcc}
        env={"prod"} // Use "stag" for staging, "prod" for production
        udf1={""}
        udf2={""}
        udf3={""}
        udf4={""}
        udf5={""}
        udf6={""}
        udf7={""}
        udf8={""}
        udf9={""}
        udf10={""}
        udf11={""}
        udf18={""}
        udf19={""}
        udf20={""}
      />
    </div>
  );
}

export default SabpaisaPaymentGateway;
