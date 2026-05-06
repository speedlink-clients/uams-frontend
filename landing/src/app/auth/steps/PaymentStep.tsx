import React from "react";
import { HiOutlineCreditCard, HiOutlineInformationCircle } from "react-icons/hi";
import { Box, Flex, Text, Button, Stack, Heading, Separator, Spinner, Alert } from "@chakra-ui/react";
import { useDepartmentAnnualDue, useInitializePayment } from "@hooks/auth.hook";

import { type PaymentStepProps } from "@type/auth.type";

const PaymentStep: React.FC<PaymentStepProps> = () => {
  const { data: duesResponse, isLoading: isFetchingDues, error: duesError } = useDepartmentAnnualDue();
  const duesData = duesResponse?.data;

  const { mutate: initializePayment, isPending: isInitializing } = useInitializePayment({
    onSuccess: (response) => {
      // Redirect to Paystack checkout page
      window.location.href = response.data.authorizationUrl;
    }
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handlePayNow = () => {
    const callbackUrl = import.meta.env.VITE_CALLBACK_URL;
    localStorage.setItem("paymentCallbackUrl", callbackUrl);
    initializePayment(callbackUrl);
  };

  return (
    <Flex 
      minH="100vh" 
      w="full" 
      fontFamily="'Inter'"
      bgImage={"url(/images/slider.jpeg)"}
      bgSize={"cover"}
      bgPos={"center"}
      bgRepeat={"no-repeat"}
      py="10"
      justify={"center"}
      align={"center"}
    >
      <Box
        w={{ base: "full", lg: "500px" }}
        bg="white"
        p={{ base: "8", md: "12" }}
        rounded="3xl"
        boxShadow="2xl"
        mx="4"
      >
        <Stack gap="10">
          <Box textAlign="center">
            <Heading size="2xl" fontWeight="black" color="fg.emphasized" mb="3">
              Pay Department Annual Dues
            </Heading>
            <Text fontSize="14px" fontWeight="medium" color="fg.subtle">
              Complete your payment to activate your account
            </Text>
          </Box>

          {duesError && (
            <Alert.Root status="error" variant="subtle" rounded="xl">
              <Alert.Indicator>
                <HiOutlineInformationCircle />
              </Alert.Indicator>
              <Alert.Title fontSize="13px" fontWeight="bold">
                {(duesError as any).message || "Failed to load dues information."}
              </Alert.Title>
            </Alert.Root>
          )}

          <Stack gap="6">
            {isFetchingDues ? (
              <Flex 
                bg="gray.50" 
                border="1px solid" 
                borderColor="gray.200" 
                rounded="xl" 
                p="6" 
                align="center" 
                justify="center"
              >
                <Spinner size="sm" color="gray.400" />
                <Text ml="3" fontSize="13px" fontWeight="medium" color="gray.400">
                  Loading dues...
                </Text>
              </Flex>
            ) : duesData ? (
              <Box bg="gray.50" border="1px solid" borderColor="gray.200" rounded="xl" p="6">
                <Stack gap="4">
                  <Flex align="center" justify="between">
                    <Text fontSize="13px" fontWeight="medium" color="gray.400">Department Dues</Text>
                    <Text fontSize="15px" fontWeight="bold" color="fg.emphasized">
                      {formatCurrency(duesData.departmentDues)}
                    </Text>
                  </Flex>
                  <Flex align="center" justify="between">
                    <Text fontSize="13px" fontWeight="medium" color="gray.400">Portal Access Fee</Text>
                    <Text fontSize="15px" fontWeight="bold" color="fg.emphasized">
                      {formatCurrency(duesData.accessFee)}
                    </Text>
                  </Flex>
                  <Flex align="center" justify="between">
                    <Text fontSize="13px" fontWeight="medium" color="gray.400">Merchant Fee</Text>
                    <Text fontSize="15px" fontWeight="bold" color="fg.emphasized">
                      {formatCurrency(duesData.breakdown.summary.total_merchant_fees + duesData.breakdown.summary.transaction_charges)}
                    </Text>
                  </Flex>
                  <Separator borderColor="gray.200" />
                  <Flex align="center" justify="between">
                    <Text fontSize="13px" fontWeight="bold" color="gray.500" textTransform="uppercase" letterSpacing="wide">
                      Total Fee
                    </Text>
                    <Text fontSize="2xl" fontWeight="black" color="blue.600">
                      {formatCurrency(duesData.totalFee)}
                    </Text>
                  </Flex>
                </Stack>
              </Box>
            ) : (
              <Box bg="gray.50" border="1px solid" borderColor="gray.200" rounded="xl" p="6">
                <Text fontSize="13px" color="gray.400" textAlign="center">
                  Unable to load dues information
                </Text>
              </Box>
            )}

            <Button
              onClick={handlePayNow}
              loading={isInitializing}
              disabled={isInitializing || isFetchingDues || !duesData}
              size="xl"
              w="full"
              colorPalette="green"
              rounded="xl"
              fontWeight="black"
              boxShadow="lg"
            >
              <HiOutlineCreditCard />
              Pay Now
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Flex>
  );
};

export default PaymentStep;
