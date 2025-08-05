export interface TemplateData {
    data: any;
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    isSuccess: boolean;
  }
  
  export interface TemplateDataParams {
    // limit: number;
    // page: number;
    search: string;
    tags:any;
  }
  
  // StandardServiceTemplate.ts

export interface StandardServiceTemplate {
    name: string; // The name of the template
    fileUrl: string; // The URL to the template file
    tags: string[]; // An array of tags associated with the template
}