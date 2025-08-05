export interface LeadsData {
    _id: string;
    date: string;
    clientName: string;
    caseType: {
        _id: string;
        name: string;
    };
    leadStatus: string;
    emailAddress: string;
    phoneNumber: string;
    notes?: string;
    source?: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    isActive: boolean;
    isDeleted: boolean;
}
export interface LeadsDataParams {
    limit: number;
    page: number;
    leadStatus: any;
    caseType: any;
}