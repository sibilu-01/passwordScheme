const fs = require('fs');

const loadParagraph = (filename) => {
  try {
      const dataBuffer = fs.readFileSync(`./paragraphs/${filename}`)
      const paragraph = dataBuffer.toString()
      return paragraph
  } catch(e) {
      return []
  }
}

let paragraphs = [
    { _id: 1, content: loadParagraph('paragraph1.txt')},
    { _id: 2, content: loadParagraph('paragraph2.txt')},
    { _id: 3, content: loadParagraph('paragraph3.txt')}
  ];
  module.exports = paragraphs;
