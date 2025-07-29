import { nanoid } from "nanoid";
import { Plugin } from "unified";
import { Root, HTML, Heading } from "mdast";
import { Section } from "@/types/types";

export const remarkSectionIdPlugin: Plugin<[], Root> = () => {
  return (tree: Root) => {
    const sections: Section[] = [];
    let currentId: string | null = null;
    let currentContent: string[] = [];
    let currentTitle: string = "";

    const flushSection = () => {
      if (currentId && (currentTitle || currentContent.join("").trim())) {
        sections.push({
          id: currentId,
          title: currentTitle,
          content: currentContent.join("\n").trim(),
        });
      }
      currentId = null;
      currentTitle = "";
      currentContent = [];
    };

    tree.children.forEach((node, index) => {
      if (node.type === "html" && node.value.match(/<!-- section-id: (\w+) -->/)) {
        flushSection();
        currentId = node.value.match(/<!-- section-id: (\w+) -->/)?.[1] ?? null;
      } else if (node.type === "heading" && node.depth === 2) {
        // If there is a current section, flush it
        flushSection();

        // If no id, generate a new one and insert the comment node before the heading
        if (!currentId) {
          const newId = nanoid();
          // Insert double line break before the id comment if previous node is not a break
          if (
            index > 0 &&
            tree.children[index - 1].type !== "thematicBreak" &&
            tree.children[index - 1].type !== "html"
          ) {
            tree.children.splice(index, 0, {
              type: "html",
              value: "\n\n",
            } as HTML);
          }
          tree.children.splice(index, 0, {
            type: "html",
            value: `<!-- section-id: ${newId} -->`,
          } as HTML);
          currentId = newId;
        }

        // Set the current title
        currentTitle = (node as Heading).children
          .map(child => child.type === "text" ? (child as any).value : "")
          .join("");
        currentContent = [];
      } else {
        currentContent.push((node as any).value || "");
      }
    });

    // Flush the last section at the end of the document
    flushSection();

    // Attach sections to the tree for later use
    (tree as any).sections = sections;
    return;
  };
};