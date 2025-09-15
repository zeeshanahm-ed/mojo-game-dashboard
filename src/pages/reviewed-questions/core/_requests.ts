import api from "services/api/api";

const CONTRIBUTION_URL = "/contribution"

export function getAllReviewedQuestions(params: any) {
    return api.get(`${CONTRIBUTION_URL}/reviewed-questions`, { params }).then((response) => response.data);
};
export function moveQuestionToPandingPool(body: any) {
    return api.post(`${CONTRIBUTION_URL}/move-to-pending`, body).then((response) => response.data);
};
export function publishQuestion(body: any) {
    return api.post(`${CONTRIBUTION_URL}/publish`, body).then((response) => response.data);
};