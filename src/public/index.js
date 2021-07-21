const express = require('express');
const app = express();
const port = 3000;
const route = require('../routes')

app.set('view engine','ejs');
app.set('views','./src/views');

app.use(express.static(__dirname+'../../public'));

//routes
route(app);
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})