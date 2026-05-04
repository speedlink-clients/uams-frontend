// @type/auth.type.ts
export interface User {
    id?: string;
    role?: string;
    roles?: string[];
    email?: string;
    name?: string;
    [key: string]: any;
}

export interface AuthState {
    token: string;
    expireAt: string;
    user?: User;
    setAuth: (auth: Partial<AuthState>) => void;
    clearAuth: () => void;
}

export interface LoginData {
    email: string;
    password?: string;
}

export interface LoginResponse {
    status: string;
    message?: string;
    data: {
        token: string;
        expiresIn: string;
        user: User;
    };
}

export interface ActivateAccountRequest {
  email: string;
  phone: string;
  password: string;
}

export interface ActivateAccountResponse {
  status: string;
  message: string;
}

export interface InitializePaymentResponse {
  success: boolean;
  message: string;
  data: {
    authorizationUrl: string;
    reference: string;
    transactionId: string;
  };
}

export interface DepartmentDuesResponse {
  success: boolean;
  data: {
    departmentDues: number;
    accessFee: number;
    totalFee: number;
    breakdown: {
      summary: {
        total_base_fees: number;
        total_merchant_fees: number;
        transaction_charges: number;
        total_fee: number;
      };
    };
  };
}

export interface IdCardFeeResponse {
  success: boolean;
  data: {
    idCardFee: number;
    merchant_fee: number;
    transaction_charges: number;
    subtotal: number;
  };
}

export interface ConfirmIdCardPaymentResponse {
  success: boolean;
  transaction: {
    id: string;
    reference: string;
    student_id: string;
    student_reg_number: string;
    student_name: string;
    payment_for: string;
    amount: string;
    currency: string;
    status: string;
    paid_at: string;
  };
}