export const USER_ROLES = {
  SUPER_ADMIN: 'superAdmin',
  CONTENT_MANAGER: 'contentManager',
  FINANCE_MANAGER: 'financeManager',
  READ_ONLY: "readOnly"
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