const app = require('./src/app');
const database = require('./src/config/database');
const cors = require('cors');
const http = require('http').Server(app);

database();

app.use(cors());


http.listen(5000, () => {
  console.log('App has started on 5000');
});
