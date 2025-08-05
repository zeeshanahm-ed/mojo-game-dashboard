export const CASES_DATA_TYPE = {
  MONTHLY_REPORTS: 0,
  EVF_FORMS: 1,
  SIGNED_REPORTS: 2,
  TIME_SHEET: 3,
  AUTHORIZATION_FORM: 4,
  OTHER: 5,
  EXTENSIONS: 6,
} as const;

export const CASES_DATA_SUBTYPE = {
  NOTES: 0,
  DOCUMENT: 1,
  OTHER: 2,
} as const;

export const SERVICE_BILLING_DATA_TYPE = {
  AUTHORIZATION_FORM: 0,
  INVOICE: 1,
  OTHER: 2
}

export const SERVICE_BILLING_SUBTYPE = {
  NOTES: 0,
  DOCUMENT: 1,
  OTHER: 2,
}
export const USER_ROLES = {
  SUPER_ADMIN: 'admin',
  OPERATION: 'operations',
  BILLING: 'billing'
}

export const splitFileName = (file: string) => {
  // Ensure file is a string and handle undefined case safely


  const fileNameWithExtension = decodeURIComponent(Array.isArray(file) ? file[0]?.split('/').pop()?.split('?')[0] || '' : file?.split('/').pop()?.split('?')[0] || '');
  return fileNameWithExtension;
};


export const handleErrorMineImg: React.EventHandler<React.SyntheticEvent<HTMLImageElement, Event>> = (e) => {
  const target = e.target as HTMLImageElement;
  target.src = 'https://www.pngfind.com/pngs/m/676-6764065_default-profile-picture-transparent-hd-png-download.png'
};