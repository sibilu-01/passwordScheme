const fs = require('fs');

const loadParagraph = () => {
  try {
      const dataBuffer = fs.readFileSync('./paragraphs/paragraph1.txt')
      const paragraph = dataBuffer.toString()
      return paragraph
  } catch(e) {
      return []
  }
}

let paragraphs = [
    { _id: 1, content: loadParagraph()},
    { _id: 2, content: loadParagraph()},
    { _id: 3, content: loadParagraph()}
  ];
  module.exports = paragraphs;
