import { ROLES } from "utils/Enums";
export const ROLES_OPTIONS = [
    // { label: 'Super Admin', value: ROLES.SUPER_ADMIN },
    { label: 'Content Moderator', value: ROLES.CONTENT_MANAGER },
    { label: 'Finance Manager', value: ROLES.FINANCE_MANAGER },
    { label: 'Read Only', value: ROLES.READ_ONLY },
    { label: 'Reviewer', value: ROLES.REVIEWER },
    // { label: 'Moderator', value: ROLES.MODERATOR }

];

export const IMAGE_FILE_TYPES = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
export const VIDEO_FILE_TYPES = [".mp4", ".webm", ".ogg"];
export const AUDIO_FILE_TYPES = [".mp3", ".wav", ".ogg", ".mpeg"];
export const READ_ONLY_ROLES = [ROLES.READ_ONLY];
export const EDITOR_ONLY_ROLES = [ROLES.CONTENT_MANAGER, ROLES.SUPER_ADMIN]
