export interface Signup {
    name: string;
    phoneNumber?: string;
    email: string;
    password: string;
    licenseKey?: string;
    companyName: string;
}

export interface SignnUpResponse {
    id: number;
    name: string;
    token: string;
    email: string;
    phoneNumber: string;
    profilePicUrl: string;
    validated: boolean;
    selectedCompanyId: boolean;
}

export interface Login {
    email: string;
    password: string;
}

export interface resetPassword {
    token: string;
    password: string;
}

export interface UpdatePassword {
  token?: string
  userId?: number
  password?: string
  newPassword?: string
}

export interface forgotPassword {
    email?: string
}

export interface UserDetail {
    id?: number;
    name?: string;
    email?: string;
    phoneNumber?: string;
    profilePicUrl?: string;
    selectedCompanyId?: number;
    companyName?: string;
    companyRole?: string;
    logo?: string;
}

export interface PaymentResposne {
    status: number;
    data: string;
    environment: string;
    error_desc: string;
}