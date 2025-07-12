export type Section = {
  id: string;
  title: string;
  content: string;
};

export type Draft = {
  sections: Section[];
  selections: string[];
  markdown: string;
};

export type AppSettings = {
  preview: boolean;
  [key: string]: any;
};
