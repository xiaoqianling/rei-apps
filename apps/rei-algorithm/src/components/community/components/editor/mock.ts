import { Descendant } from "slate";

export const SlateMock: Descendant[] = [
  {
    type: "paragraph",
    children: [
      {
        text: "This is editable ",
      },
      {
        text: "rich",
        bold: true,
      },
      {
        text: " text, ",
      },
      {
        text: "much",
        italic: true,
      },
      {
        text: " better than a ",
      },
      {
        text: "<textarea>",
        code: true,
      },
      {
        text: "!",
      },
    ],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "Since it's rich text, you can do things like turn a selection of text ",
      },
      {
        text: "bold",
        bold: true,
      },
      {
        text: ", or add a semantically rendered block quote in the middle of the page, like this:",
      },
    ],
  },
  {
    type: "md-quote",
    children: [
      {
        text: "A wise quote.",
      },
    ],
  },
  {
    type: "insert",
    children: [
      {
        text: "",
      },
    ],
    content: "",
  },
  {
    type: "note",
    level: "tip",
    content: "This\n is\n a\n tip",
    children: [
      {
        text: "Tip",
      },
    ],
  },
  {
    type: "note",
    level: "warning",
    content: "This is a warn",
    children: [
      {
        text: "Tip",
      },
    ],
  },
  {
    type: "note",
    level: "error",
    content: "This is a ERROR",
    children: [
      {
        text: "Tip",
      },
    ],
  },
  {
    type: "paragraph",
    align: "center",
    children: [
      {
        text: "Try it out for yourself!",
      },
    ],
  },
];
