const fs = require("fs");

const loadParagraph = id => {
  try {
    const dataBuffer = fs.readFileSync(`./paragraphs/paragraph${id}.txt`);
    const paragraph = dataBuffer.toString();
    return paragraph;
  } catch (e) {
    return [];
  }
};

let paragraphs = [
  { _id: 1, paragraph: loadParagraph(1) },
  { _id: 2, paragraph: loadParagraph(2) },
  { _id: 3, paragraph: loadParagraph(3) }
];
module.exports = paragraphs;
