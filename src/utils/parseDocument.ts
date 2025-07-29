import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import { remarkSectionIdPlugin } from "./remarkSectionIdPlugin";

export function parseDocument(markdown: string) {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkSectionIdPlugin);

  const tree = processor.parse(markdown);
  processor.runSync(tree);

  // Sections are attached by the plugin
  const sections = (tree as any).sections || [];
  // Extract title (first H1)
  let title = "";
  for (const node of tree.children) {
    if (node.type === "heading" && node.depth === 1) {
      title = node.children.map((c: any) => c.value).join("");
      break;
    }
  }
  return { sections, title };
}