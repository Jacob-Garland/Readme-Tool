import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import { remarkSectionIdPlugin } from "./remarkSectionIdPlugin";
import { Section } from "@/types/types";

export const parseDocument = (markdown: string): {sections: Section[] } => {
    const file = unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkSectionIdPlugin)
        .processSync(markdown);

    return {
        sections: (file.data.sections as Section[]) || [],
    };
};