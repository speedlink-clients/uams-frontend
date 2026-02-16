
import React from 'react';

export type ProgramType = 'Undergraduate' | 'Post Graduate' | 'Masters' | 'PhD';

export interface Program {
  id: string;
  name: string;
  code: string;
  type: ProgramType;
  year: string;
  duration: string;
  status: 'Active' | 'Completed' | 'Retired';
}

export interface Course {
  id: string;
  code: string;
  title: string;
  units: number;
  type: 'Department' | 'General' | 'Faculty';
  lecturers: string[];
  prerequisites: string[];
  fee: number;
  availableFor: ProgramType[];
  status: 'Active' | 'Archived';
  level: string;
  semester: string;
}

export type StudentRole = 'Class Rep' | 'Dept Rep' | 'None' | 'Bachelors' | 'PGD' | 'Masters';

export interface Student {
  id: string;
  regNo: string;
  matNo: string;
  surname: string;
  otherNames: string;
  name: string; // Keeping for backward compatibility temporarily
  email: string;
  phoneNo: string;
  department: string;
  level: string;
  programId: string;
  role: StudentRole;
  sex: string;
  admissionMode: string;
  entryQualification: string;
  faculty: string;
  degreeCourse: string;
  programDuration: string;
  degreeAwardCode: string;
  permissions?: string[];
  createdAt: string;
  isActive: boolean;
  classRepRole?: 'CLASS_REP' | 'ASSISTANT_CLASS_REP';
}

export interface Staff {
  id: string;
  staffId: string;
  name: string;
  email: string;
  role: string;
  activeFeatures: {
    results: boolean;
    finance: boolean;
    timetable: boolean;
  };
}

export interface Session {
  id: string;
  name: string; // e.g. 2024/2025
  status: 'Current' | 'Past' | 'Upcoming';
}

export type ViewType = 'Dashboard' | 'Program & Courses' | 'Students' | 'Lecturers' | 'Payments' | 'ID Card Management' | 'Timetable' | 'Announcements' | 'Settings' | 'Notifications' | 'Profile';

export interface Permission {
  id: string;
  name: string;
  key: string;
}

export interface Role {
  id: string;
  idNo: string;
  name: string;
  status: 'Student' | 'Staff';
  office: string;
  permissions: {
    createProgram: boolean;
    createCourses: boolean;
    createBilling: boolean;
    viewPayments: boolean;
    createTest: boolean;
  };
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  date: string;
}

export interface ChartDataItem {
  year: string;
  value: number;
}

export interface StudentProfile {
  id: string;
  universityId: string;
  departmentId: string;
  programId: string;
  userId: string;
  studentId: string;
  level: string;
  levelId: string;
  sessionId: string;
  isActive: boolean;
  academicStanding: string;
  probationStartDate: string | null;
  probationEndDate: string | null;
  totalCreditsEarned: number;
  currentGPA: string;
  createdAt: string;
  updatedAt: string;
  idCard: string | null;
  Department: {
    name: string;
    code: string;
    type: string;
    description: string | null;
  };
  Level: {
    id: string;
    name: string;
  };
  Program: {
    id: string;
    name: string;
    programTypeId: string;
    programType: {
      id: string;
      name: string;
      type: string;
      code: string;
    };
  };
  user: {
    fullName: string;
    email: string;
    phone: string;
    avatar: string | null;
    Roles: Array<{
      name: string;
      description: string;
    }>;
  };
  session: {
    id: string;
    name: string;
    isActive: boolean;
  };
  activeSemester: Array<{
    id: string;
    name: string;
    startDate: string;
    endDate: string;
  }>;
}

// Authentication related interfaces
export interface AuthData {
  token: string;
  role: string;
  tenantId: string;
  universityId: string;
  facultyId: string | null;
  departmentId: string | null;
  email?: string;
  username?: string;
}

export interface UserSession {
  authData: AuthData | null;
  isLoggedIn: boolean;
}

export interface LoginProps {
  onLogin: (authData: AuthData) => void;
}

export interface StudentInfo {
  studentId: string;
  registrationNo: string | null;
  fullName: string;
  email: string;
}

export interface TransactionData {
  id: string;
  reference: string;
  amount: number;
  status: "success" | "pending" | "failed";
  paymentType: string;
  paymentMethod: string | null;
  currency: string;
  createdAt: string;
  paidAt: string | null;
  studentInfo: StudentInfo | null;
}

export interface TransactionStatistics {
  totalTransactions: number;
  totalAmount: number;
}
