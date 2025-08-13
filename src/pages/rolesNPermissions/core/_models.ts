export interface GetUserDataParems {
    limit?: number;
    page?: number;
    name?: string;
    status?: string;
}


export interface DeleteSingleUserParams {
    userId: string;
}

export interface ChangeRoleParams {
    role: string;
}

export interface AddUserParams {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    password: string;
    email: string;
    role: string;
    status: string;
    age?: string;
    gender?: string;
}
