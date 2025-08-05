import { Dayjs } from "dayjs"
export interface AlertsDataParams {
    limit: number;
    page: number;
    alertDate: Dayjs | string | null;
    assignedTo: string | null;
}
