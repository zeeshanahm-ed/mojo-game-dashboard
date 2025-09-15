import api from "services/api/api";


export function getSubscriptionHistory(params: any) {
    return api.get("/stripe/subscriptions", { params }).then(response => response.data)
}