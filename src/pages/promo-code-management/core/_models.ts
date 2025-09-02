export interface AddPromoCodeTypes {
    code: string,
    percentage: number,
    usageLimit: number,
    assignedUsers: string[],
    validFrom: string | undefined,
    validUntil: string | undefined,
}