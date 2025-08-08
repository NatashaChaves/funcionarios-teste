const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const funcionarioRoutes = require('./src/routes/funcionarioRoutes');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/funcionarios', funcionarioRoutes);

const port = 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
