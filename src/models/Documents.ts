export class Documents {
  id: number;
  folio: string;
  tome: string;
  year: number;
  clientId: number;
  documentStatusId: number;
  documentTypeId: number;
  expectedCompletionDate: string;
  operations: [];
  groups: { name: string }[];
  grantors: [];
  attachments: [];
  documentAttachments: [];
  documentComments: [];
  documentProperties: [];
  documentFiles: [];
}
