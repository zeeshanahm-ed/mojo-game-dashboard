import api from "services/api/api";

const REVIEWER_URL = '/user';

export function getAllReviewers(params: any) {
    return api.get(`${REVIEWER_URL}/reviewers`, { params }).then((response) => response.data);
}