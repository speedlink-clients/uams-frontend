export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entity: string;
  entityId: string;
  details: any;
  ipAddress: string;
  createdAt: string;
}
