export type SavedJson = {
  id: string;
  name: string | null;
  json: object;
  plan: object | null;
  parts: any[] | null;
  createdAt: Date;
  updatedAt: Date;
};
