import { useState, useEffect, useCallback } from "react";
import { toaster } from "@components/ui/toaster";
import { Loader2 } from "lucide-react";
import { AcademicServices } from "@services/academic.service";
import { ProgramServices } from "@services/program.service";
import { PaymentServices } from "@services/payment.service";
import { useAsync } from "react-use";
import { z } from "zod";  
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Flex, Text } from "@chakra-ui/react";

const paymentConfigSchema = z.object({
  academic_session_id: z.string().min(1,"Academic session is required").optional(),
  program_type_id: z.string().min(1,"Program type is required").optional(),
  paystack_public_key: z.string().min(1,"Paystack public key is required").optional(),
  paystack_secret_key: z.string().min(1,"Paystack secret key is required").optional(),
  annual_access_fee: z.number().min(1,"Annual access fee is required").optional(),
  annual_access_merchant_fee: z.number().min(1,"Annual access merchant fee is required").optional(),
  annual_access_split_key: z.string().min(1,"Annual access split key is required").optional(),
  department_annual_access_dues: z.number().min(1,"Department annual access dues is required").optional(),
  department_annual_access_merchant_fee: z.number().min(1,"Department annual access merchant fee is required").optional(),
  department_annual_access_split_key: z.string().min(1,"Department annual access split key is required").optional(),
  id_card_payment: z.number().min(1,"ID card payment is required").optional(),
  id_card_merchant_fee: z.number().min(1,"ID card merchant fee is required").optional(),
  id_card_split_key: z.string().min(1,"ID card split key is required").optional(),
  transcript_fee: z.number().min(1,"Transcript fee is required").optional(),
  transcript_merchant_fee: z.number().min(1,"Transcript merchant fee is required").optional(),
  transcript_split_key: z.string().min(1,"Transcript split key is required").optional(),
  transcript_digital_fee: z.number().min(0).optional(),
  transcript_digital_merchant_fee: z.number().min(0).optional(),
  transcript_courier_fee: z.number().min(0).optional(),
  transcript_courier_merchant_fee: z.number().min(0).optional(),
  transcript_pickup_fee: z.number().min(0).optional(),
  transcript_pickup_merchant_fee: z.number().min(0).optional()
})

type PaymentConfigData = z.infer<typeof paymentConfigSchema>;

const usePaymentConfigForm = () => {
  return useForm<PaymentConfigData>({
    resolver: zodResolver(paymentConfigSchema),
    defaultValues: {
      academic_session_id: "",
      program_type_id: "",
      paystack_public_key: "",
      paystack_secret_key: "",
      annual_access_fee: 0,
      annual_access_merchant_fee: 0,
      annual_access_split_key: "",
      department_annual_access_dues: 0,
      department_annual_access_merchant_fee: 0,
      department_annual_access_split_key: "",
      id_card_payment: 0,
      id_card_merchant_fee: 0,
      id_card_split_key: "",
      transcript_fee: 0,
      transcript_merchant_fee: 0,
      transcript_split_key: "",
      transcript_digital_fee: 0,
      transcript_digital_merchant_fee: 0,
      transcript_courier_fee: 0,
      transcript_courier_merchant_fee: 0,
      transcript_pickup_fee: 0,
      transcript_pickup_merchant_fee: 0
    }
  })
}

const PaymentSettingsTab = () => {
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const [activeProgramType, setActiveProgramType] = useState<{id:string,name:string}>({id:"",name:""});
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Fetch API data
  const sessions = useAsync(async () => {
    try {
        const data = await AcademicServices.getSessions();
        const raw = data;
        const sessionArray: any[] = Array.isArray(raw) ? raw : raw ? [raw] : [];
        const activeSessions = sessionArray.filter((s) => s.isActive);
        if (activeSessions.length > 0) setActiveSessionId(activeSessions[0].id);
        return activeSessions;
      } catch (error) {
        console.error("Failed to fetch session:", error);
        toaster.error({ title: "Failed to fetch active session" });
      }
  }, []);

  const programTypes = useAsync(async () => {
      try {
        const typesData = await ProgramServices.getProgramTypes();
        const types = Array.isArray(typesData) ? typesData : (typesData as any)?.data || [];
        const activeTypes = types?.filter((type: any) => type.isActive) || [];
        if (activeTypes.length > 0) setActiveProgramType({ id: activeTypes[0].id, name: activeTypes[0].name });
        return activeTypes;
      } catch (err) {
        console.error("Failed to fetch program types:", err);
      }
  }, [sessions.value])

  const getCredentials = useAsync(async () => {
    try {
      if(!activeSessionId || !activeProgramType.id) return null;
      const data = await PaymentServices.getPaymentConfig(activeSessionId, activeProgramType.id);
      return data;
    } catch (error) {
      console.error("Failed to fetch credentials:", error);
      toaster.error({ title: "Failed to fetch credentials" });
      return null;
    }
  }, [activeSessionId, activeProgramType.id]); 

  const paymentConfigForm = usePaymentConfigForm();
  const annualAccessSplitKey = paymentConfigForm.watch("annual_access_split_key");

  useEffect(() => {
      paymentConfigForm.setValue("department_annual_access_split_key", annualAccessSplitKey);
  }, [annualAccessSplitKey, paymentConfigForm]);

  useEffect(() => {
    if (getCredentials.value) {
      const data = getCredentials.value;
      paymentConfigForm.reset({
        academic_session_id: data.metadata?.academic_session_id,
        program_type_id: data.metadata?.program_type_id,
        paystack_public_key: data.paystack_config?.public_key,
        paystack_secret_key: data.paystack_config?.secret_key,
        annual_access_fee: data.payment_amount_settings?.annual_access?.base_fee || 0,
        annual_access_merchant_fee: data.payment_amount_settings?.annual_access?.merchant_fee || 0,
        annual_access_split_key: data.payment_amount_settings?.annual_access?.split_key || "",
        department_annual_access_dues: data.payment_amount_settings?.department_annual_access?.base_fee || 0,
        department_annual_access_merchant_fee: data.payment_amount_settings?.department_annual_access?.merchant_fee || 0,
        department_annual_access_split_key: data.payment_amount_settings?.department_annual_access?.split_key || "",
        id_card_payment: data.payment_amount_settings?.id_card?.base_fee || 0,
        id_card_merchant_fee: data.payment_amount_settings?.id_card?.merchant_fee || 0,
        id_card_split_key: data.payment_amount_settings?.id_card?.split_key || "",
        transcript_fee: data.payment_amount_settings?.transcript?.base_fee || 0,
        transcript_merchant_fee: data.payment_amount_settings?.transcript?.merchant_fee || 0,
        transcript_split_key: data.payment_amount_settings?.transcript?.split_key || "",
        transcript_digital_fee: data.payment_amount_settings?.transcript?.transcript_delivery_options?.digital_delivery?.base_amount || 0,
        transcript_digital_merchant_fee: data.payment_amount_settings?.transcript?.transcript_delivery_options?.digital_delivery?.merchant_fee || 0,
        transcript_courier_fee: data.payment_amount_settings?.transcript?.transcript_delivery_options?.courier_service?.base_amount || 0,
        transcript_courier_merchant_fee: data.payment_amount_settings?.transcript?.transcript_delivery_options?.courier_service?.merchant_fee || 0,
        transcript_pickup_fee: data.payment_amount_settings?.transcript?.transcript_delivery_options?.physical_pickup?.base_amount || 0,
        transcript_pickup_merchant_fee: data.payment_amount_settings?.transcript?.transcript_delivery_options?.physical_pickup?.merchant_fee || 0
      });
    } else if (getCredentials.value === null) { 
      // Reset form if no config
      paymentConfigForm.reset({
        annual_access_fee: 0, annual_access_merchant_fee: 0, annual_access_split_key: "",
        department_annual_access_dues: 0, department_annual_access_merchant_fee: 0, department_annual_access_split_key: "",
        id_card_payment: 0, id_card_merchant_fee: 0, id_card_split_key: "",
        transcript_fee: 0, transcript_merchant_fee: 0, transcript_split_key: "",
        transcript_digital_fee: 0, transcript_digital_merchant_fee: 0,
        transcript_courier_fee: 0, transcript_courier_merchant_fee: 0,
        transcript_pickup_fee: 0, transcript_pickup_merchant_fee: 0
      });
    }
  }, [getCredentials.value, activeSessionId, activeProgramType.id, paymentConfigForm]);

  const patchPaymentConfig = useCallback(async () => {
    const payload = {
      academic_session_id: activeSessionId,
      program_type_id: activeProgramType.id,
      paystack_public_key: paymentConfigForm.getValues("paystack_public_key")?.trim(),
      paystack_secret_key: paymentConfigForm.getValues("paystack_secret_key")?.trim(),
      annual_access_fee: paymentConfigForm.getValues("annual_access_fee"),
      annual_access_merchant_fee: paymentConfigForm.getValues("annual_access_merchant_fee"),
      annual_access_split_key: paymentConfigForm.getValues("annual_access_split_key")?.trim(),
      department_annual_access_dues: paymentConfigForm.getValues("department_annual_access_dues") ,
      department_annual_access_merchant_fee: paymentConfigForm.getValues("department_annual_access_merchant_fee"),
      department_annual_access_split_key: paymentConfigForm.getValues("department_annual_access_split_key")?.trim(),
      id_card_payment: paymentConfigForm.getValues("id_card_payment"),
      id_card_merchant_fee: paymentConfigForm.getValues("id_card_merchant_fee"),
      id_card_split_key: paymentConfigForm.getValues("id_card_split_key")?.trim(),
      transcript_fee: paymentConfigForm.getValues("transcript_fee"),
      transcript_merchant_fee: paymentConfigForm.getValues("transcript_merchant_fee"),
      transcript_split_key: paymentConfigForm.getValues("transcript_split_key")?.trim(),
      transcript_delivery_options: {
        digital_delivery: {
          base_amount: paymentConfigForm.getValues("transcript_digital_fee"),
          merchant_fee: paymentConfigForm.getValues("transcript_digital_merchant_fee"),
          description: "Email delivery"
        },
        courier_service: {
          base_amount: paymentConfigForm.getValues("transcript_courier_fee"),
          merchant_fee: paymentConfigForm.getValues("transcript_courier_merchant_fee"),
          description: "Doorstep delivery"
        },
        physical_pickup: {
          base_amount: paymentConfigForm.getValues("transcript_pickup_fee"),
          merchant_fee: paymentConfigForm.getValues("transcript_pickup_merchant_fee"),
          description: "Pick up at registry"
        }
      }
    }
    
    setIsSaving(true);
    try {
      await PaymentServices.patchPaymentConfig(payload);
      toaster.success({ title: "Payment config updated successfully" });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save payment config:", error);
      toaster.error({ title: "Failed to save payment config" });
    } finally {
      setIsSaving(false);
    }
  }, [activeSessionId, activeProgramType.id, paymentConfigForm]); 

  const inputStyle: React.CSSProperties = {
      width: "100%", padding: "8px 12px", border: "1px solid #e2e8f0", 
      borderRadius: "6px", fontSize: "14px", outline: "none", color: "#374151"
  };

  const getReadonlyStyle = () => ({
      ...inputStyle, background: "#f3f4f6", border: "1px solid transparent", pointerEvents: "none" as const
  });

  return (
    <Box bg="white" borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="gray.200" p="10">
      <Flex wrap="wrap" gap="4" justifyContent="space-between" alignItems="flex-start" mb="6">
        <Text fontSize="xl" fontWeight="bold">Payment Settings</Text>
        <button 
          onClick={() => setIsEditing(!isEditing)} 
          disabled={isSaving}
          style={{
            padding: "8px 16px", borderRadius: "6px", fontWeight: 600, transition: "background 0.2s",
            background: isEditing ? "#ef4444" : "#64748b", color: "white", cursor: isSaving ? "not-allowed" : "pointer",
            opacity: isSaving ? 0.5 : 1
          }}
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </Flex>

      {/* sessions */}
      <Box mb="10" pb="8" borderBottom="1px solid" borderColor="gray.200">
        <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#374151", marginBottom: "12px" }}>
          Active Academic Session
        </label>
        <Box position="relative" maxW="400px">
          <select 
            value={activeSessionId} 
            onChange={(e) => setActiveSessionId(e.target.value)} 
            disabled={sessions.loading}
            style={{ width: "100%", padding: "10px 16px", border: "1px solid #d1d5db", borderRadius: "8px", background: "#f9fafb" }}
          >
            {sessions.loading && <option value="">Loading sessions...</option>}
            {!sessions.loading && (!sessions.value || sessions.value.length === 0) && (
              <option value="">No active session found</option>
            )}
            {!sessions.loading && sessions.value?.map((session) => (
              <option key={session.id} value={session.id}>
                {session.name}
              </option>
            ))}
          </select>
        </Box>
      </Box>

      {/* program types */}
      <Flex mt="6" borderRadius="md" bg="gray.100" p="2" gap="2" w="fit" alignItems="center">
        {programTypes.loading ? (
          <Text fontSize="sm" color="gray.600" px="4" py="2">Loading program types...</Text>
        ) : (
           <>
           {programTypes.value?.map((type: any) => (
            <button 
              onClick={() => setActiveProgramType({ id: type.id, name: type.name })} 
              key={type.id} 
              style={{
                cursor: "pointer", padding: "8px 16px", borderRadius: "6px", fontSize: "14px", fontWeight: 500,
                background: activeProgramType.id === type.id ? "white" : "transparent",
                color: activeProgramType.id === type.id ? "black" : "#4b5563",
                boxShadow: activeProgramType.id === type.id ? "0 1px 2px rgba(0,0,0,0.05)" : "none",
                border: "none"
              }}
            >
              {type.name}
            </button>
           ))}
           </>
        )}
      </Flex>

      <form onSubmit={paymentConfigForm.handleSubmit(patchPaymentConfig)}>
      {/* public /private keys */}
      <Flex direction="column" gap="4" p="4" borderRadius="lg" border="1px solid" borderColor="gray.200" mt="12">
          <Text fontWeight="semibold">Paystack keys</Text>
          <Box as="hr" borderColor="gray.200" />
          <Flex gap="4" w="full" direction={{ base: "column", md: "row" }}>
             {/* public key */}
              <Flex direction="column" gap="2" flex="1">
                <label htmlFor="paystack_public_key" style={{ fontSize: "14px" }}>Public Key</label>
                <input 
                  {...paymentConfigForm.register("paystack_public_key")} 
                  readOnly={!isEditing} id="paystack_public_key" 
                  style={isEditing ? inputStyle : getReadonlyStyle()} 
                />
              </Flex>

              {/* private key */}
              <Flex direction="column" gap="2" flex="1">
                <label htmlFor="paystack_secret_key" style={{ fontSize: "14px" }}>Private Key</label>
                <input 
                  {...paymentConfigForm.register("paystack_secret_key")} 
                  readOnly={!isEditing} id="paystack_secret_key" 
                  style={isEditing ? inputStyle : getReadonlyStyle()} 
                />
              </Flex>
          </Flex>
      </Flex>

      {/* informations grid */}
      <Box display="grid" gridTemplateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap="4" mt="10">
        
        {/* annual access fee */}
        <Flex direction="column" gap="3" p="4" borderRadius="lg" border="1px solid" borderColor="gray.200">
          <Text fontWeight="semibold">Annual Access Fee</Text>
          <Box as="hr" borderColor="gray.200" />

          <Flex direction="column" gap="2">
            <label htmlFor="annual_access_fee_split_key" style={{ fontSize: "14px" }}>Split key</label>
            <input {...paymentConfigForm.register("annual_access_split_key")} placeholder="SPL_xxxxxxxxxx" readOnly={!isEditing} id="annual_access_fee_split_key" style={isEditing ? inputStyle : getReadonlyStyle()} />
          </Flex>

          <Flex direction="column" gap="2">
            <label htmlFor="annual_access_fee_amount" style={{ fontSize: "14px" }}>Amount</label>
            <input type="number" {...paymentConfigForm.register("annual_access_fee", { valueAsNumber: true })} readOnly={!isEditing} id="annual_access_fee_amount" style={isEditing ? inputStyle : getReadonlyStyle()} />
          </Flex>

          <Flex direction="column" gap="2">
            <label htmlFor="annual_access_fee_merchant_fee" style={{ fontSize: "14px" }}>Merchant fee</label>
            <input type="number" {...paymentConfigForm.register("annual_access_merchant_fee", { valueAsNumber: true })} readOnly={!isEditing} id="annual_access_fee_merchant_fee" style={isEditing ? inputStyle : getReadonlyStyle()} />
          </Flex>

          <Text color="red.500" fontSize="sm">{paymentConfigForm.formState.errors.annual_access_merchant_fee?.message}</Text>
          <Text color="red.500" fontSize="sm">{paymentConfigForm.formState.errors.annual_access_fee?.message}</Text>
          <Text color="red.500" fontSize="sm">{paymentConfigForm.formState.errors.annual_access_split_key?.message}</Text>
        </Flex>

        {/* annual department dues fee */}
        <Flex direction="column" gap="3" p="4" borderRadius="lg" border="1px solid" borderColor="gray.200">
          <Text fontWeight="semibold">Annual Department Dues</Text>
          <Box as="hr" borderColor="gray.200" />
  
          <Flex direction="column" gap="2">
            <label htmlFor="annual_department_dues_split_key" style={{ fontSize: "14px" }}>Split key</label>
            <input type="text" {...paymentConfigForm.register("department_annual_access_split_key")} placeholder="SPL_xxxxxxxxxx" readOnly id="annual_department_dues_split_key" style={getReadonlyStyle()} />
          </Flex>

          <Flex direction="column" gap="2">
            <label htmlFor="annual_department_dues_amount" style={{ fontSize: "14px" }}>Amount</label>
            <input type="number" {...paymentConfigForm.register("department_annual_access_dues", { valueAsNumber: true })} readOnly={!isEditing} id="annual_department_dues_amount" style={isEditing ? inputStyle : getReadonlyStyle()} />
          </Flex>

          <Flex direction="column" gap="2">
            <label htmlFor="annual_department_dues_merchant_fee" style={{ fontSize: "14px" }}>Merchant fee</label>
            <input type="number" {...paymentConfigForm.register("department_annual_access_merchant_fee", { valueAsNumber: true })} readOnly={!isEditing} id="annual_department_dues_merchant_fee" style={isEditing ? inputStyle : getReadonlyStyle()} />
          </Flex>

          <Text color="red.500" fontSize="sm">{paymentConfigForm.formState.errors.department_annual_access_merchant_fee?.message}</Text>
          <Text color="red.500" fontSize="sm">{paymentConfigForm.formState.errors.department_annual_access_dues?.message}</Text>
          <Text color="red.500" fontSize="sm">{paymentConfigForm.formState.errors.department_annual_access_split_key?.message}</Text>
        </Flex>

        {/* ID CARD payment */}
        <Flex direction="column" gap="3" p="4" borderRadius="lg" border="1px solid" borderColor="gray.200">
          <Text fontWeight="semibold">ID Card Payment</Text>
          <Box as="hr" borderColor="gray.200" />

          <Flex direction="column" gap="2">
            <label htmlFor="id_card_payment_split_key" style={{ fontSize: "14px" }}>Split key</label>
            <input {...paymentConfigForm.register("id_card_split_key")} placeholder="SPL_xxxxxxxxxx" readOnly={!isEditing} id="id_card_payment_split_key" style={isEditing ? inputStyle : getReadonlyStyle()} />
          </Flex>

          <Flex direction="column" gap="2">
            <label htmlFor="id_card_payment_amount" style={{ fontSize: "14px" }}>Amount</label>
            <input type="number" {...paymentConfigForm.register("id_card_payment", { valueAsNumber: true })} readOnly={!isEditing} id="id_card_payment_amount" style={isEditing ? inputStyle : getReadonlyStyle()} />
          </Flex>

          <Flex direction="column" gap="2">
            <label htmlFor="id_card_payment_merchant_fee" style={{ fontSize: "14px" }}>Merchant fee</label>
            <input type="number" {...paymentConfigForm.register("id_card_merchant_fee", { valueAsNumber: true })} readOnly={!isEditing} id="id_card_merchant_fee" style={isEditing ? inputStyle : getReadonlyStyle()} />
          </Flex>

          <Text color="red.500" fontSize="sm">{paymentConfigForm.formState.errors.id_card_merchant_fee?.message}</Text>
          <Text color="red.500" fontSize="sm">{paymentConfigForm.formState.errors.id_card_payment?.message}</Text>
          <Text color="red.500" fontSize="sm">{paymentConfigForm.formState.errors.id_card_split_key?.message}</Text>
        </Flex>

        {/* transcript */}
        <Flex direction="column" gap="4" p="4" borderRadius="lg" border="1px solid" borderColor="gray.200" gridColumn={{ base: "1", lg: "1 / -1" }}>
          <Text fontWeight="semibold">Transcript Delivery Options</Text>
          <Box as="hr" borderColor="gray.200" mb="2" />
  
          <Flex direction={{ base: "column", md: "row" }} gap="4" maxW="800px" mb="6">
            <Flex direction="column" gap="2" flex="1">
              <label htmlFor="transcript_amount" style={{ fontSize: "14px", fontWeight: 500 }}>Global Base Amount</label>
              <input type="number" {...paymentConfigForm.register("transcript_fee", { valueAsNumber: true })} readOnly={!isEditing} id="transcript_amount" style={isEditing ? inputStyle : getReadonlyStyle()} />
            </Flex>

            <Flex direction="column" gap="2" flex="1">
              <label htmlFor="transcript_merchant_fee" style={{ fontSize: "14px", fontWeight: 500 }}>Global Merchant Fee</label>
              <input type="number" {...paymentConfigForm.register("transcript_merchant_fee", { valueAsNumber: true })} readOnly={!isEditing} id="transcript_merchant_fee" style={isEditing ? inputStyle : getReadonlyStyle()} />
            </Flex>

            <Flex direction="column" gap="2" flex="1">
              <label htmlFor="transcript_split_key" style={{ fontSize: "14px", fontWeight: 500 }}>Global Split key</label>
              <input {...paymentConfigForm.register("transcript_split_key")} placeholder="SPL_xxxxxxxxxx" readOnly={!isEditing} id="transcript_split_key" style={isEditing ? inputStyle : getReadonlyStyle()} />
              <Text color="red.500" fontSize="sm">{paymentConfigForm.formState.errors.transcript_split_key?.message}</Text>
            </Flex>
          </Flex>

          <Box display="grid" gridTemplateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }} gap="6">
            <Box bg="slate.50" p="4" borderRadius="md" border="1px solid" borderColor="slate.200">
              <Text fontSize="sm" fontWeight="bold" color="slate.800" mb="3">Digital Delivery</Text>
              <Text fontSize="xs" color="slate.500" mb="4">Email delivery</Text>
              <Flex direction="column" gap="3">
                <Box>
                  <label htmlFor="transcript_digital_fee" style={{ fontSize: "12px", display: "block", marginBottom: "4px" }}>Amount</label>
                  <input type="number" {...paymentConfigForm.register("transcript_digital_fee", { valueAsNumber: true })} readOnly={!isEditing} id="transcript_digital_fee" style={isEditing ? inputStyle : getReadonlyStyle()} />
                </Box>
                <Box>
                  <label htmlFor="transcript_digital_merchant_fee" style={{ fontSize: "12px", display: "block", marginBottom: "4px" }}>Merchant fee</label>
                  <input type="number" {...paymentConfigForm.register("transcript_digital_merchant_fee", { valueAsNumber: true })} readOnly={!isEditing} id="transcript_digital_merchant_fee" style={isEditing ? inputStyle : getReadonlyStyle()} />
                </Box>
              </Flex>
            </Box>

            <Box bg="slate.50" p="4" borderRadius="md" border="1px solid" borderColor="slate.200">
              <Text fontSize="sm" fontWeight="bold" color="slate.800" mb="3">Courier Service</Text>
              <Text fontSize="xs" color="slate.500" mb="4">Doorstep delivery</Text>
              <Flex direction="column" gap="3">
                <Box>
                  <label htmlFor="transcript_courier_fee" style={{ fontSize: "12px", display: "block", marginBottom: "4px" }}>Amount</label>
                  <input type="number" {...paymentConfigForm.register("transcript_courier_fee", { valueAsNumber: true })} readOnly={!isEditing} id="transcript_courier_fee" style={isEditing ? inputStyle : getReadonlyStyle()} />
                </Box>
                <Box>
                  <label htmlFor="transcript_courier_merchant_fee" style={{ fontSize: "12px", display: "block", marginBottom: "4px" }}>Merchant fee</label>
                  <input type="number" {...paymentConfigForm.register("transcript_courier_merchant_fee", { valueAsNumber: true })} readOnly={!isEditing} id="transcript_courier_merchant_fee" style={isEditing ? inputStyle : getReadonlyStyle()} />
                </Box>
              </Flex>
            </Box>

            <Box bg="slate.50" p="4" borderRadius="md" border="1px solid" borderColor="slate.200">
              <Text fontSize="sm" fontWeight="bold" color="slate.800" mb="3">Physical Pickup</Text>
              <Text fontSize="xs" color="slate.500" mb="4">Pick up at registry</Text>
              <Flex direction="column" gap="3">
                <Box>
                  <label htmlFor="transcript_pickup_fee" style={{ fontSize: "12px", display: "block", marginBottom: "4px" }}>Amount</label>
                  <input type="number" {...paymentConfigForm.register("transcript_pickup_fee", { valueAsNumber: true })} readOnly={!isEditing} id="transcript_pickup_fee" style={isEditing ? inputStyle : getReadonlyStyle()} />
                </Box>
                <Box>
                  <label htmlFor="transcript_pickup_merchant_fee" style={{ fontSize: "12px", display: "block", marginBottom: "4px" }}>Merchant fee</label>
                  <input type="number" {...paymentConfigForm.register("transcript_pickup_merchant_fee", { valueAsNumber: true })} readOnly={!isEditing} id="transcript_pickup_merchant_fee" style={isEditing ? inputStyle : getReadonlyStyle()} />
                </Box>
              </Flex>
            </Box>
          </Box>
        </Flex>
      </Box>

      {isEditing && (
        <button 
          type="submit"
          disabled={isSaving}
          style={{
            marginTop: "24px", background: "#3b82f6", color: "white", padding: "8px 24px",
            borderRadius: "6px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px", border: "none",
            cursor: isSaving ? "not-allowed" : "pointer", opacity: isSaving ? 0.5 : 1
          }}
        >
          {isSaving ? (
            <>
              <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      )}
      </form>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </Box>
  )
}

export default PaymentSettingsTab;
