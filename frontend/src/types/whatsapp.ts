export interface WhatsAppInstance {
  instanceName: string;
  instanceId: string;
  integration: string;
  webhookWaBusiness: string | null;
  accessTokenWaBusiness: string;
  status: 'connecting' | 'connected' | 'disconnected';
}

export interface QRCode {
  pairingCode: string | null;
  code: string;
  base64: string;
}

export interface CreateInstanceResponse {
  instance: WhatsAppInstance;
  hash: string;
  webhook: Record<string, any>;
  websocket: Record<string, any>;
  rabbitmq: Record<string, any>;
  nats: Record<string, any>;
  sqs: Record<string, any>;
  settings: {
    rejectCall: boolean;
    msgCall: string;
    groupsIgnore: boolean;
    alwaysOnline: boolean;
    readMessages: boolean;
    readStatus: boolean;
    syncFullHistory: boolean;
    wavoipToken: string;
  };
  qrcode: QRCode;
}

export interface UserInstance {
  id: string;
  instanceName: string;
  instanceId: string;
  createdAt: string;
}

export interface ListInstancesResponse {
  instances: UserInstance[];
  count: number;
  limit: number;
}

export interface WhatsAppGroup {
  id: string;
  subject: string;
  creation?: number;
  owner?: string;
  participants?: number;
}

export interface ListGroupsResponse {
  groups: WhatsAppGroup[];
}
