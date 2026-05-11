import { z } from "zod";

export const paymentConfigSchema = z.object({
  program_type_id: z.string().min(1,"Program type is required"),
  paystack_public_key: z.string().min(1,"Paystack public key is required"),
  paystack_secret_key: z.string().min(1,"Paystack secret key is required"),
  annual_access_fee: z.number().min(1,"Annual access fee is required"),
  annual_access_merchant_fee: z.number().min(1,"Annual access merchant fee is required"),
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

export type PaymentConfigData = z.infer<typeof paymentConfigSchema>;