const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("morgan");
<<<<<<< HEAD:expressReact/express_backend/index.js
const port = process.env.PORT || 3001
const coloursRouter = require('./routes/colours.js')
=======
const port = process.env.PORT || 3001;
const paragraphsRouter = require("./routes/paragraph.js");
>>>>>>> 864750429fc2f554bc8ed1b4ce570b1a7dcb32dc:express_backend/index.js

app.use(logger("dev"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
<<<<<<< HEAD:expressReact/express_backend/index.js
app.use("/colours", coloursRouter);
=======

app.use("/paragraphs", paragraphsRouter);
>>>>>>> 864750429fc2f554bc8ed1b4ce570b1a7dcb32dc:express_backend/index.js

app.use((err, req, res, next) => {
  console.error(err);
  res.sendStatus(500);
});

app.listen(port, function() {
  console.log("Runnning on " + port);
});
module.exports = app;
