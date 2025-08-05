import { ClientInfo, FormattedClient } from "pages/services/core/_modals";

export const formatUserData = (data: ClientInfo[] | undefined): FormattedClient[] => {
    if (!data) return [];
    return data.map((d) => ({
        _id: d?._id,
        selectedClient: false,
        basicInformation: d?.basicInformation ?? {},
        clientId: d?._id,
        id: d?._id,
        clientName: d?.name,
        text: d?.name || '',
        value: d?._id || '',
    }));
};

export const formatServiceType = (data: any) => {
    if (!data) return [];
    return data?.map((t: { _id: any; name: any }) => ({
        value: t?._id,
        label: t?.name,
    }));
};

export function formatUSPhoneNumber(phone: string) {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^1?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return `+1 (${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone; // Return the original phone number if it doesn't match the format
}