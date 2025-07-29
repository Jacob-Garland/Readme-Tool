import { nanoid } from "nanoid";
import { Plugin } from "unified";
import { Root, HTML, Heading } from "mdast";
import { Section } from "@/types/types";

export const remarkSectionIdPlugin: Plugin<[], Root> = () => {
  return (tree: Root) => {
    const sections: Section[] = [];
    let currentId: string | null = null;
    let currentContent: string[] = [];
    // Add id to headings
    tree.children.forEach((node, index) => {
        if (node.type === "html" && node.value.match(/<!-- section-id: (\w+) -->/)) {
            currentId = node.value.match(/<!-- section-id: (\w+) -->/)?.[1] ?? null;
        } else if (node.type === "heading" && node.depth === 2) {
            if (currentId) {
                // If we have a currentId, we are in a section
                const title = (node as Heading).children
                  .map(child => child.type === "text" ? (child as any).value : "")
                  .join("");
                sections.push({
                    id: currentId,
                    title,
                    content: currentContent.join("\n"),
                });
                currentId = null; // Reset for next section
                currentContent = []; // Reset content for next section
            } else {
                // If no id, generate a new one for the section
                const newId = nanoid();
                tree.children.splice(index, 0, {
                    type: "html",
                    value: `<!-- section-id: ${newId} -->`,
                } as HTML);
                currentId = newId;
            }
        } else {
            currentContent.push((node as any).value || "");
        }
    });

    // Optionally, attach sections to the tree for later use
    (tree as any).sections = sections;
    // The transformer must return void or Root
    return;
  };
};