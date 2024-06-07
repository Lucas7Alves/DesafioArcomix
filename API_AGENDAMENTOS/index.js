const express = require("express");
const app = express();
const port = 3000;
const router = require("./routers/index");
const conexao = require("./infraestrutura/conexao");
const tabelas = require("./infraestrutura/tabelas");

tabelas.init(conexao);
app.use(express.json());

router(app);

app.listen(port, (error) => {
  if(error) {
    console.log("Deu erro");
    return;
  }
  console.log("Rodando!!")
})