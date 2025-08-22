import api from 'services/api/api';
import { AllQuestionParams } from './_modals';

const QUESTION_URL = '/question';

export function getQuestionsData(params: AllQuestionParams) {
    return api.get(`${QUESTION_URL}/all`, { params }).then((response) => response.data);
}
export function deleteQuestion(id: string) {
    return api.delete(`${QUESTION_URL}/${id}`).then((response) => response);
}
export function updateQuestionData(data: any) {
    return api.patch(`${QUESTION_URL}`, data).then((response) => response);
}