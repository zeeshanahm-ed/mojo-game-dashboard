export interface CategoryInterface {
    id: number;
    categoryName: string;
    categoryType: string;
    section: string;
};

export interface PromoCodeRecord {
    id: string;
    createdDate: string;
    promoCode: string;
    percentage: number;
    usageLimit: number;
    assigned: "All users" | "custom users";
    promoAnalyticsLink: string;
    expiryDate: string;
    assignTo: "all" | "custom";
    customUsers?: string[];
    discountDuration: {
        startDate: string;
        endDate: string;
    };
}