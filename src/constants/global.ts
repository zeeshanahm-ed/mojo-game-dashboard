import { ROLES } from "utils/Enums";
import { PromoCodeRecord } from "utils/Interfaces";

export const promoCodesData: PromoCodeRecord[] = [
    {
        id: "1",
        createdDate: "10/12/2025",
        promoCode: "FD13D20",
        percentage: 15,
        usageLimit: 30,
        assigned: "All users",
        assignTo: "all",
        promoAnalyticsLink: "/promo/FD13D20/usage",
        expiryDate: "12/08/2025",
        discountDuration: {
            startDate: "10/12/2025",
            endDate: "12/08/2025"
        }
    },
    {
        id: "2",
        createdDate: "10/12/2025",
        promoCode: "RE1239R",
        percentage: 20,
        usageLimit: 2,
        assigned: "custom users",
        assignTo: "custom",
        customUsers: ["user123", "user456"],
        promoAnalyticsLink: "/promo/RE1239R/usage",
        expiryDate: "12/08/2025",
        discountDuration: {
            startDate: "10/12/2025",
            endDate: "12/08/2025"
        }
    },
    {
        id: "3",
        createdDate: "10/12/2025",
        promoCode: "FD13D20",
        percentage: 15,
        usageLimit: 15,
        assigned: "All users",
        assignTo: "all",
        promoAnalyticsLink: "/promo/FD13D20/usage",
        expiryDate: "12/08/2025",
        discountDuration: {
            startDate: "10/12/2025",
            endDate: "12/08/2025"
        }
    },
    {
        id: "4",
        createdDate: "10/12/2025",
        promoCode: "FD13D20",
        percentage: 15,
        usageLimit: 25,
        assigned: "All users",
        assignTo: "all",
        promoAnalyticsLink: "/promo/FD13D20/usage",
        expiryDate: "12/08/2025",
        discountDuration: {
            startDate: "10/12/2025",
            endDate: "12/08/2025"
        }
    },
    {
        id: "5",
        createdDate: "10/12/2025",
        promoCode: "FD13D20",
        percentage: 15,
        usageLimit: 15,
        assigned: "All users",
        assignTo: "all",
        promoAnalyticsLink: "/promo/FD13D20/usage",
        expiryDate: "12/08/2025",
        discountDuration: {
            startDate: "10/12/2025",
            endDate: "12/08/2025"
        }
    }
];

export const ROLES_OPTIONS = [
    // { label: 'Super Admin', value: ROLES.SUPER_ADMIN },
    { label: 'Content Manager', value: ROLES.CONTENT_MANAGER },
    { label: 'Finance Manager', value: ROLES.FINANCE_MANAGER },
    { label: 'Read Only', value: ROLES.READ_ONLY },
];

export const IMAGE_FILE_TYPES = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
export const VIDEO_FILE_TYPES = [".mp4", ".webm", ".ogg"];
export const AUDIO_FILE_TYPES = [".mp3", ".wav", ".ogg"];
