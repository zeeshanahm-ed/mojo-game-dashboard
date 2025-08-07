import api from 'services/api/api';

const QUESTION_URL = '/questions';

export function getQuestionsData(params: any) {
    return api.get<any>(QUESTION_URL, { params }).then((response) => response);
}
export function deleteQuestion(ids: any) {
    return api.delete(`${QUESTION_URL}`, { data: ids }).then((response) => response);
}
export function updateQuestionData(data: any) {
    return api.patch(`${QUESTION_URL}`, data).then((response) => response);
}