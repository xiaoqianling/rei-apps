import { Descendant } from "slate";

export const SlateMock: Descendant[] = [
  {
    type: "h1",
    children: [
      {
        text: "Welcome to Slate",
      },
    ],
  },
  {
    type: "h2",
    children: [
      {
        text: "A completely customizable framework for building rich text editors",
      },
    ],
  },
  {
    type: "h3",
    children: [
      {
        text: "A completely customizable framework for building rich text editors",
      },
    ],
  },
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
    type: "tip",
    level: "tip",
    content: "This\n is\n a\n tip",
    children: [
      {
        text: "Tip",
      },
    ],
  },
  {
    type: "tip",
    level: "warning",
    content: "This is a warn",
    children: [
      {
        text: "Tip",
      },
    ],
  },
  {
    type: "tip",
    level: "error",
    content: "This is a ERROR",
    children: [
      {
        text: "Tip",
      },
    ],
  },
  {
    type: "code-block",
    language: "js",
    code: "console.log('Hello, world!')",
    children: [{ text: "" }],
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
