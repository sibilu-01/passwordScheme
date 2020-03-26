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
    { _id: 1, paragraph: loadParagraph()},
    { _id: 2, paragraph: loadParagraph()},
    { _id: 3, paragraph: loadParagraph()}
  ];
  module.exports = paragraphs;
