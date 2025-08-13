export interface GetUserDataParems {
  limit?: number;
  page?: number;
  name?: string;
  status?: string;
}

export interface ChangeStatusParams {
  userId: string;
  status: 'Active' | 'Suspended' | undefined;
}
