import { Dayjs } from "dayjs"
export interface WarningsDataParams {
    limit: number;
    page: number;
    warningDate?: string | null | Dayjs;
    assignedTo?: string | null;
}