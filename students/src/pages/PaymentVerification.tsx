import { Link, useSearchParams } from "react-router-dom";
import { toaster } from "../components/ui/toaster";
import apiClient from "../services/api";
import { useEffect, useMemo, useState } from "react";
import {
  AbsoluteCenter,
  Button,
  Container,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Heading } from "lucide-react";

const PaymentVerificationPage = () => {
  // get payment status on mount to update hasPaid state
  const [sq, _] = useSearchParams();
  const trxRef = useMemo(() => sq.get("trxRef"));
  const [verificationStatus, setVerificationStatus] = useState<
    "pending" | "success" | "failed"
  >("pending");

  const paymentCallbackUrl = useMemo(
    () => localStorage.getItem("paymentCallbackUrl") || "",
  );

  // handle successful id card payment
  useEffect(() => {
    if (trxRef) {
      apiClient
        .post("/payment/verify", {
          reference: trxRef,
        })
        .then((res) => {
          if (res.data.success) {
            toaster.success({ description: "Payment verified successfully!" });
            setVerificationStatus("success");
          }
        })
        .catch(() => {
          toaster.error({ description: "Payment verified successfully!" });
          setVerificationStatus("failed");
        });
    }
  }, [trxRef]);

  if (verificationStatus === "pending") {
    return (
      <AbsoluteCenter>
        <Text>
          Verifying payment <Spinner />
        </Text>
      </AbsoluteCenter>
    );
  }

  if (verificationStatus === "failed") {
    return (
      <AbsoluteCenter>
        <Stack gap="4">
          <Heading size={48} color="red" alignSelf="center">
            Payment Verification failed
          </Heading>

          <Link to={paymentCallbackUrl || "/"}>
            <Button>Go back</Button>
          </Link>
        </Stack>
      </AbsoluteCenter>
    );
  }

  return (
    <AbsoluteCenter>
      <Stack gap="4">
        <Heading size={48} alignSelf="center">
          Payment Verification Successful
        </Heading>

        <Link to={paymentCallbackUrl || "/"}>
          <Button>Continue</Button>
        </Link>
      </Stack>
    </AbsoluteCenter>
  );
};

export default PaymentVerificationPage;
