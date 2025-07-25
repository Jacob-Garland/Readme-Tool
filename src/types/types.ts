export type Section = {
  id: string;
  title: string;
  content: string;
};

export type Draft = {
  sections: Section[];
  selections: string[];
  markdown: string;
  title?: string;
};

export type AppSettings = {
  preview: boolean;
  [key: string]: any;
};

export type SaveStatus = "idle" | "saving" | "saved" | "error";