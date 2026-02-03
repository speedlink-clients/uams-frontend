
import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import PaymentSettings from "@/components/payments/SpltKeysConfig";
import { PaymentSplitKeysSection } from "@/components/payments/PaymentSplitKeysSection";
import { programsCoursesApi } from "@/api/programscourseapi";
import { ProgramTypeResponse } from "@/api/types";
import {useAsync} from "react-use";
import { Session } from "@/types";
import { z } from "zod";  
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;


const paymentConfigShema = z.object({
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
  transcript_split_key: z.string().min(1,"Transcript split key is required").optional()
})


type PaymentConfigData = z.infer<typeof paymentConfigShema>;

const usePaymentConfigForm = () => {
  return useForm<PaymentConfigData>({
    resolver: zodResolver(paymentConfigShema),
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
      transcript_split_key: ""
    }
  })
}

export const PaymentSettingsTab = () => {
  // states
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const [activeProgramType, setActiveProgramType] = useState<{id:string,name:string}>({id:"",name:""});
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // api calls
  const sessions = useAsync(async () => {

    try {
        const response = await axios.get(
          `${BASE_URL}/department-admins/department-sessions`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const raw = response.data.session;
        const sessionArray: any[] = Array.isArray(raw)
          ? raw
          : raw
          ? [raw]
          : [];

        // More forgiving filter
        const activeSessions = sessionArray.filter((s) => s.isActive);
        setActiveSessionId(activeSessions[0].id);
        return activeSessions;
      } catch (error) {
        console.error("Failed to fetch session:", error);
        toast.error("Failed to fetch active session");
      }

  }, []);

  // Fetch Program Types
  const programTypes = useAsync(async () => {
      try {
        const types = await programsCoursesApi.getProgramTypes();
        const activeTypes = types?.filter((type) => type.isActive) || [];
        setActiveProgramType({id:activeTypes[0].id,name:activeTypes[0].name});
        return activeTypes;
      } catch (err) {
        console.error("Failed to fetch program types:", err);
      }
  }, [sessions.value])

  const getCredentials = useAsync(async () => {
    try {
      if(!activeSessionId || !activeProgramType.id) return;
      const response = await axios.get(
        `${BASE_URL}/university-admin/payment-config?academic_session_id=${activeSessionId}&program_type_id=${activeProgramType.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch credentials:", error);
      toast.error("Failed to fetch credentials");
    }
  }, [activeSessionId,activeProgramType.id]); 


  // const form
  const paymentConfigForm = usePaymentConfigForm();

  // watch annual access split key
  const annualAccessSplitKey = paymentConfigForm.watch("annual_access_split_key");

  // update department annual access split key
  useEffect(()=>{
      paymentConfigForm.setValue("department_annual_access_split_key", annualAccessSplitKey);
  },[annualAccessSplitKey])

  // prefill inputs
  useEffect(() => {
    if (getCredentials.value) {
      const data = getCredentials.value;
      paymentConfigForm.reset({
        academic_session_id: data.metadata?.academic_session_id,
        program_type_id: data.metadata?.program_type_id,
        paystack_public_key: data.paystack_config?.public_key,
        paystack_secret_key: data.paystack_config?.secret_key,
        annual_access_fee: data.payment_amount_settings?.annual_access?.base_fee,
        annual_access_merchant_fee: data.payment_amount_settings?.annual_access?.merchant_fee,
        annual_access_split_key: data.payment_amount_settings?.annual_access?.split_key,
        department_annual_access_dues: data.payment_amount_settings?.department_annual_access?.base_fee,
        department_annual_access_merchant_fee: data.payment_amount_settings?.department_annual_access?.merchant_fee,
        department_annual_access_split_key: data.payment_amount_settings?.department_annual_access?.split_key,
        id_card_payment: data.payment_amount_settings?.id_card?.base_fee,
        id_card_merchant_fee: data.payment_amount_settings?.id_card?.merchant_fee,
        id_card_split_key: data.payment_amount_settings?.id_card?.split_key,
        transcript_fee: data.payment_amount_settings?.transcript?.base_fee,
        transcript_merchant_fee: data.payment_amount_settings?.transcript?.merchant_fee,
        transcript_split_key: data.payment_amount_settings?.transcript?.split_key
      });
     
    }
  }, [getCredentials.value,activeSessionId,activeProgramType.id]);



  const patchPaymentConfig = useCallback(async () => {
    const payload = {
      academic_session_id: activeSessionId,
      program_type_id: activeProgramType.id,
      paystack_public_key: paymentConfigForm.getValues("paystack_public_key"),
      paystack_secret_key: paymentConfigForm.getValues("paystack_secret_key"),
      annual_access_fee: paymentConfigForm.getValues("annual_access_fee"),
      annual_access_merchant_fee: paymentConfigForm.getValues("annual_access_merchant_fee"),
      annual_access_split_key: paymentConfigForm.getValues("annual_access_split_key"),
      department_annual_access_dues: paymentConfigForm.getValues("department_annual_access_dues"),
      department_annual_access_merchant_fee: paymentConfigForm.getValues("department_annual_access_merchant_fee"),
      id_card_payment: paymentConfigForm.getValues("id_card_payment"),
      id_card_merchant_fee: paymentConfigForm.getValues("id_card_merchant_fee"),
      id_card_split_key: paymentConfigForm.getValues("id_card_split_key"),
      transcript_fee: paymentConfigForm.getValues("transcript_fee"),
      transcript_merchant_fee: paymentConfigForm.getValues("transcript_merchant_fee"),
      transcript_split_key: paymentConfigForm.getValues("transcript_split_key")
    }
    try {
      const response = await axios.patch(
        `${BASE_URL}/university-admin/payment-config`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Payment config updated successfully");
    } catch (error) {
      console.error("Failed to fetch credentials:", error);
      toast.error("Failed to fetch credentials");
    }
  }, [activeSessionId,activeProgramType.id]); 


  return <>
    <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10">
      <div className="flex justify-between align-start">
        <h2 className="text-xl font-bold">Payment Settings</h2>
        <button onClick={()=> setIsEditing(!isEditing)} className="bg-gray-500 text-white px-4 py-2 rounded-md">{isEditing ? "Cancel" : "Edit"}</button>
      </div>

      {/* sessions */}
      <select defaultValue={activeSessionId} value={activeSessionId} onChange={(e) => setActiveSessionId(e.target.value)} name="session" id="session" className="bg-gray-100 p-2 px-4 rounded-md">
        <option value="">{sessions?.loading ? "Loading sessions..." : "Select Session"}</option>
        {sessions.value?.map((session) => (
          <option key={session.id} value={session.id}>
            {session.name}
          </option>
        ))}
      </select>

      {/* program types */}
      <section className="mt-6 rounded-md bg-gray-100 p-2 flex gap-2 w-fit">
        {programTypes?.loading ? (
          <p>Loading program types...</p>
        ) : (
           <>
           {programTypes.value?.map((type) => (
            <button onClick={()=> setActiveProgramType({id:type.id,name:type.name})} key={type.id} 
            className={`cursor-pointer px-4 py-2 rounded-md 
              ${activeProgramType.id === type.id ? "shadow-sm bg-white text-black" : ""}`}>{type.name}</button>
           ))}
           </>
        )}
      </section>


      <form onSubmit={paymentConfigForm.handleSubmit(patchPaymentConfig)}>
      {/* public /private keys */}
      <article className="flex flex-col gap-4 p-4 rounded-lg border border-gray-200 mt-12">
          <h3 className="font-semibold">Paystack keys</h3>
          <hr className="border-gray-200" />
      <article className="flex gap-4 w-full">
         {/* public key */}
          <div className="flex flex-col gap-2 flex-1">
            <label htmlFor="paystack_public_key">Public Key</label>
            <input {...paymentConfigForm.register("paystack_public_key")} readOnly={!isEditing}  id="paystack_public_key" name="paystack_public_key" className={`${isEditing ? "border-gray-200" : "border-transparent bg-gray-100 pointer-events-none"} border-gray-200 p-2 border rounded-md`} />
          </div>

          {/* private key */}
          <div className="flex flex-col gap-2 flex-1">
            <label htmlFor="paystack_private_key">Private Key</label>
            <input {...paymentConfigForm.register("paystack_secret_key")} readOnly={!isEditing}  id="paystack_private_key" className={`${isEditing ? "border-gray-200" : "bg-gray-100 pointer-events-none"} border-gray-200 p-2 border rounded-md`} />
          </div>
      </article>
      </article>


      {/* informations */}
      <section className="grid grid-cols-2 gap-4 mt-10">
        {/* annual access fee */}
        <article className="flex flex-col gap-3 p-4 rounded-lg border border-gray-200">
          <h3 className="font-semibold">Annual Access Fee</h3>

          <hr className="border-gray-200" />

          {/* split key */}
          <div className="flex flex-col gap-2">
            <label htmlFor="annual_access_fee_split_key">Split key</label>
            <input {...paymentConfigForm.register("annual_access_split_key")} placeholder="SPL_xxxxxxxxxx" readOnly={!isEditing}  id="annual_access_fee_split_key" className={`${isEditing ? "border-gray-200" : "border-transparent bg-gray-100 pointer-events-none"} border-gray-200 p-2 border rounded-md`} />
          </div>

          {/* amount key */}
          <div className="flex flex-col gap-2">
            <label htmlFor="annual_access_fee_amount">Amount</label>
            <input type="number" {...paymentConfigForm.register("annual_access_fee", { valueAsNumber: true })} readOnly={!isEditing}  id="annual_access_fee_amount" className={`${isEditing ? "border-gray-200" : "bg-gray-100 pointer-events-none"} border-gray-200 p-2 border rounded-md`} />
          </div>

          {/* merchant fee key */}
          <div className="flex flex-col gap-2">
            <label htmlFor="annual_access_fee_merchant_fee">Merchant fee</label>
            <input type="number" {...paymentConfigForm.register("annual_access_merchant_fee", { valueAsNumber: true })} readOnly={!isEditing}  id="annual_access_fee_merchant_fee" className={`${isEditing ? "border-gray-200" : "bg-gray-100 pointer-events-none"} border-gray-200 p-2 border rounded-md`} />
          </div>

          {/* error message */}
          <span className="text-red-500">{paymentConfigForm.formState.errors.annual_access_merchant_fee?.message}</span>
          <span className="text-red-500">{paymentConfigForm.formState.errors.annual_access_fee?.message}</span>
          <span className="text-red-500">{paymentConfigForm.formState.errors.annual_access_split_key?.message}</span>
        </article>


        {/* annual department dues fee */}
        <article className="flex flex-col gap-3 p-4 rounded-lg border border-gray-200">
          <h3 className="font-semibold">Annual Department Dues</h3>

  <hr className="border-gray-200" />
  
          {/* split key */}
          <div className="flex flex-col gap-2">
            <label htmlFor="annual_department_dues_split_key">Split key</label>
            <input type="text" {...paymentConfigForm.register("department_annual_access_split_key")} placeholder="SPL_xxxxxxxxxx" readOnly id="annual_department_dues_split_key" name="annual_department_dues_split_key" className={`border-transparent bg-gray-100 pointer-events-none border-gray-200 p-2 border rounded-md`} />
          </div>

          {/* amount key */}
          <div className="flex flex-col gap-2">
            <label htmlFor="annual_department_dues_amount">Amount</label>
            <input type="number" {...paymentConfigForm.register("department_annual_access_dues", { valueAsNumber: true })} readOnly={!isEditing}  id="annual_department_dues_amount" className={`${isEditing ? "border-gray-200" : "bg-gray-100 pointer-events-none"} border-gray-200 p-2 border rounded-md`} />
          </div>

          {/* merchant fee key */}
          <div className="flex flex-col gap-2">
            <label htmlFor="annual_department_dues_merchant_fee">Merchant fee</label>
            <input type="number" {...paymentConfigForm.register("department_annual_access_merchant_fee", { valueAsNumber: true })} readOnly={!isEditing}  id="annual_department_dues_merchant_fee" className={`${isEditing ? "border-gray-200" : "bg-gray-100 pointer-events-none"} border-gray-200 p-2 border rounded-md`} />
          </div>

          {/* error message */}
          <span className="text-red-500">{paymentConfigForm.formState.errors.department_annual_access_merchant_fee?.message}</span>
          <span className="text-red-500">{paymentConfigForm.formState.errors.department_annual_access_dues?.message}</span>
          <span className="text-red-500">{paymentConfigForm.formState.errors.department_annual_access_split_key?.message}</span>
        </article>


        {/* ID CARD payment */}
        <article className="flex flex-col gap-2 p-4 rounded-lg border border-gray-200">
          <h3 className="font-semibold">ID Card Payment</h3>

  <hr className="border-gray-200" />

          {/* split key */}
          <div className="flex flex-col gap-2">
            <label htmlFor="id_card_payment_split_key">Split key</label>
            <input {...paymentConfigForm.register("id_card_split_key")} placeholder="SPL_xxxxxxxxxx" readOnly={!isEditing}  id="id_card_payment_split_key" className={`${isEditing ? "border-gray-200" : "border-transparent bg-gray-100 pointer-events-none"} border-gray-200 p-2 border rounded-md`} />
          </div>

          {/* amount key */}
          <div className="flex flex-col gap-2">
            <label htmlFor="id_card_payment_amount">Amount</label>
            <input type="number" {...paymentConfigForm.register("id_card_payment", { valueAsNumber: true })} readOnly={!isEditing}  id="id_card_payment_amount" className={`${isEditing ? "border-gray-200" : "bg-gray-100 pointer-events-none"} border-gray-200 p-2 border rounded-md`} />
          </div>

          {/* merchant fee key */}
          <div className="flex flex-col gap-2">
            <label htmlFor="id_card_payment_merchant_fee">Merchant fee</label>
            <input type="number" {...paymentConfigForm.register("id_card_merchant_fee", { valueAsNumber: true })} readOnly={!isEditing}  id="id_card_merchant_fee" className={`${isEditing ? "border-gray-200" : "bg-gray-100 pointer-events-none"} border-gray-200 p-2 border rounded-md`} />
          </div>

          {/* error message */}
          <span className="text-red-500">{paymentConfigForm.formState.errors.id_card_merchant_fee?.message}</span>
          <span className="text-red-500">{paymentConfigForm.formState.errors.id_card_payment?.message}</span>
          <span className="text-red-500">{paymentConfigForm.formState.errors.id_card_split_key?.message}</span>
        </article>


        {/* transcript */}
        <article className="flex flex-col gap-2 p-4 rounded-lg border border-gray-200">
          <h3 className="font-semibold">Transcript</h3>

  <hr className="border-gray-200" />
  
          {/* split key */}
          <div className="flex flex-col gap-2">
            <label htmlFor="transcript_split_key">Split key</label>
            <input {...paymentConfigForm.register("transcript_split_key")} placeholder="SPL_xxxxxxxxxx" readOnly={!isEditing}  id="transcript_split_key" name="transcript_split_key" className={`${isEditing ? "border-gray-200" : "border-transparent bg-gray-100 pointer-events-none"} border-gray-200 p-2 border rounded-md`} />
          </div>

          {/* amount key */}
          <div className="flex flex-col gap-2">
            <label htmlFor="transcript_amount">Amount</label>
            <input type="number" {...paymentConfigForm.register("transcript_fee", { valueAsNumber: true })} readOnly={!isEditing}  id="transcript_amount" className={`${isEditing ? "border-gray-200" : "bg-gray-100 pointer-events-none"} border-gray-200 p-2 border rounded-md`} />
          </div>

          {/* merchant fee key */}
          <div className="flex flex-col gap-2">
            <label htmlFor="transcript_merchant_fee">Merchant fee</label>
            <input type="number" {...paymentConfigForm.register("transcript_merchant_fee", { valueAsNumber: true })} readOnly={!isEditing}  id="transcript_merchant_fee" className={`${isEditing ? "border-gray-200" : "bg-gray-100 pointer-events-none"} border-gray-200 p-2 border rounded-md`} />
          </div>

          {/* error message */}
          <span className="text-red-500">{paymentConfigForm.formState.errors.transcript_merchant_fee?.message}</span>
          <span className="text-red-500">{paymentConfigForm.formState.errors.transcript_fee?.message}</span>
          <span className="text-red-500">{paymentConfigForm.formState.errors.transcript_split_key?.message}</span>
        </article>
      </section>

      {isEditing && <button className="mt-6 bg-blue-500 text-white p-2 px-6 rounded-md">Save Changes</button>}
      </form>
    </section>
  </>
}




























// ---------------------------------------------------- old version----------------------------------------------//

// interface Session {
//   id: string;
//   name: string;
//   isActive: boolean;
// }

// export const PaymentSettingsTab = () => {
//   const [sessions, setSessions] = useState<Session[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [activeSessionId, setActiveSessionId] = useState<string>("");
//   const [programTypes, setProgramTypes] = useState<ProgramTypeResponse[]>([]);
//   const [selectedProgramTypeId, setSelectedProgramTypeId] = useState<string>("");

//   const [fees, setFees] = useState({
//     departmentDues: "",
//     accessFee: "",
//     idCardFee: "",
//     transcriptFee: "",
//   });

//   const [isSaving, setIsSaving] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [originalFees, setOriginalFees] = useState(fees); // Backup for reset

//   // ✅ Filter fee fetch based on selected program type
//   useEffect(() => {
//     if (!selectedProgramTypeId || !activeSessionId) return;

//     const fetchFees = async () => {
//       try {
//         setLoading(true);
//         // GET /department-annual-due/program-type/{programTypeId}
//         const response = await axios.get(
//           `${BASE_URL}/department-annual-due/program-type/${selectedProgramTypeId}`,
//           {
//             headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//           }
//         );

//         if (response.data.success && Array.isArray(response.data.data)) {
//           // Filter for the specific session
//           const match = response.data.data.find((item: any) => item.sessionId === activeSessionId);
          
//           if (match) {
//               // The fees are directly on the object, not in a nested 'fees' property
//               setFees({
//                 departmentDues: match.departmentDues || "",
//                 accessFee: match.accessFee || "",
//                 idCardFee: match.idCardFee || "",
//                 transcriptFee: match.transcriptFee || "",
//               });
//               setOriginalFees({
//                 departmentDues: match.departmentDues || "",
//                 accessFee: match.accessFee || "",
//                 idCardFee: match.idCardFee || "",
//                 transcriptFee: match.transcriptFee || "",
//               });
//           } else {
//              // Reset if no matching session data found
//              const emptyFees = {
//                 departmentDues: "",
//                 accessFee: "",
//                 idCardFee: "",
//                 transcriptFee: "",
//               };
//              setFees(emptyFees);
//              setOriginalFees(emptyFees);
//           }
//         } else {
//              // Reset if response format is unexpected or empty
//              const emptyFees = {
//                 departmentDues: "",
//                 accessFee: "",
//                 idCardFee: "",
//                 transcriptFee: "",
//               };
//              setFees(emptyFees);
//              setOriginalFees(emptyFees); 
//         }
//       } catch (error) {
//         console.error("Failed to fetch fees:", error);
//          // Reset on error (or show toast)
//          setFees({
//             departmentDues: "",
//             accessFee: "",
//             idCardFee: "",
//             transcriptFee: "",
//           });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFees();
//   }, [selectedProgramTypeId, activeSessionId]);

//   /* ============================
//      FETCH & FILTER ACTIVE SESSION
//      ============================ */
//   useEffect(() => {
//     const fetchSessions = async () => {
//       try {
//         const response = await axios.get(
//           `${BASE_URL}/department-admins/department-sessions`,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );

//         const raw = response.data.session;
//         const sessionArray: Session[] = Array.isArray(raw)
//           ? raw
//           : raw
//           ? [raw]
//           : [];

//         // More forgiving filter
//         const activeSessions = sessionArray.filter((s) => s.isActive);

//         setSessions(activeSessions);

//         if (activeSessions.length > 0) {
//           setActiveSessionId(activeSessions[0].id);
//         }
//       } catch (error) {
//         console.error("Failed to fetch session:", error);
//         toast.error("Failed to fetch active session");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSessions();
//   }, []);

//   // Fetch Program Types
//   useEffect(() => {
//     const fetchTypes = async () => {
//       try {
//         const types = await programsCoursesApi.getProgramTypes();
//         setProgramTypes(types);
//         if (types.length > 0) {
//             setSelectedProgramTypeId(types[0].id);
//         }
//       } catch (err) {
//         console.error("Failed to fetch program types:", err);
//       }
//     };
//     fetchTypes();
//   }, []);

//   const handleChange = (field: string, value: string) => {
//     setFees((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleReset = () => {
//     setFees(originalFees);
//     setIsEditing(false); // Optionally exit edit mode
//     toast("Changes discarded", { icon: "↩️" });
//   };
  
//   const handleToggleEdit = () => {
//     if (isEditing) {
//         // If canceling edit mode, existing reset logic applies
//         handleReset();
//     } else {
//         setIsEditing(true);
//     }
//   };

//   const handleSave = async () => {
//     if (!activeSessionId) {
//       toast.error("No active session selected.");
//       return;
//     }

//     if (!selectedProgramTypeId) {
//         toast.error("No program type selected.");
//         return;
//       }
  

//     const hasValue = Object.values(fees).some(
//       (val) => val && val.trim() !== ""
//     );

//     if (!hasValue) {
//       toast.error("Please enter at least one fee.");
//       return;
//     }

//     setIsSaving(true);

//     try {
//       // POST /department-annual-due
//       const response = await axios.post(
//         `${BASE_URL}/department-annual-due`,
//         {
//           programTypeId: selectedProgramTypeId,
//           sessionId: activeSessionId,
//           departmentDues: Number(fees.departmentDues),
//           accessFee: Number(fees.accessFee),
//           idCardFee: Number(fees.idCardFee),
//           transcriptFee: Number(fees.transcriptFee),
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       // Check for logical error in 200 OK response
//       if (response.data && response.data.success === false) {
//           throw new Error(response.data.message || "Operation failed");
//       }

//       toast.success("Payment amount settings saved successfully.");
//       setIsEditing(false); // Exit edit mode on success
//       setOriginalFees(fees); // Update backup to current
      
//     } catch (error: any) {
//       console.error("Save Error Details:", error);
//       // Safe error extraction
//       const errorMessage = error?.response?.data?.message || error?.message || "Failed to save payment amount settings";
//       toast.error(errorMessage);
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10">
//       {/* SESSION SELECTOR */}
//       <section className="mb-10 pb-8 border-b border-gray-200">
//         <label className="block text-sm font-semibold text-gray-700 mb-3">
//           Active Academic Session
//         </label>

//         <div className="relative max-w-md">
//           <select
//             className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50"
//             value={activeSessionId}
//             onChange={(e) => setActiveSessionId(e.target.value)}
//             disabled={loading}
//           >
//             {loading && <option>Loading sessions...</option>}

//             {!loading && sessions.length === 0 && (
//               <option>No active session found</option>
//             )}

//             {!loading &&
//               sessions.map((session) => (
//                 <option key={session.id} value={session.id}>
//                   {session.name}
//                 </option>
//               ))}
//           </select>
//         </div>
//       </section>

//       <PaymentSettings sessionId={activeSessionId} />
      
//       <PaymentSplitKeysSection 
//         values={fees} 
//         onChange={handleChange}
//         programTypes={programTypes}
//         selectedProgramTypeId={selectedProgramTypeId}
//         onSelectProgramType={setSelectedProgramTypeId}
//         loading={loading}
//         onSave={handleSave}
//         isSaving={isSaving}
//         onReset={handleReset}
//         isEditing={isEditing}
//         onToggleEdit={handleToggleEdit}
//       />
//     </div>
//   );
// };
