const { Router } = require("express");
const router = Router();
const conexao = require("../infraestrutura/conexao");

//Criar agendamento
router.post("/agendamento/criar", (req, res) => {
 
  //Dados do agendamento
  const cnpj = req.body.cnpj;
  const idAgendamento = req.body.idAgendamento;
  const matricula_colaborador = req.body.matricula_colaborador;
  const tipo_cacarga = req.body.tipo_cacarga;
  const tipo_descarga = req.body.tipo_descarga;
  const recorrencia = req.body.recorrencia;
  const observacao = req.body.observacao;
  const hora_entrega = req.body.hora_entrega;
  const data_entrega = req.body.data_entrega;
  const status = req.body.status;

  //Comando para inserir os dados no banco de dados
  const sql = `INSERT INTO AGENDAMENTO (CNPJ, ID_AGENDAMENTO, MATRICULA_COLABORADOR, TIPO_CACARGA, TIPO_DESCARGA, RECORRENCIA, OBSERVACAO, HORA_ENTREGA, DATA_ENTREGA, STATUS) VALUES ('${cnpj}', '${idAgendamento}', '${matricula_colaborador}', '${tipo_cacarga}', '${tipo_descarga}', '${recorrencia}', '${observacao}', '${hora_entrega}', '${data_entrega}', '${status}')`;

  //Inserindo dados no banco de dados
  conexao.query(sql, (error, results) => {
    
    //Tratando erros
    if (error) {
      console.log("Erro ao deletar o agendamento");
      console.log(error.message);
      res.status(500).json({ message: "Erro ao criar o agendamento" });
    } else if (results.changedRows === 0) {
      console.log("Agendamento não foi criado");
      res.status(404).json({ message: "Agendamento não foi criado" });
    } else {
      console.log("Agendamento criado com sucesso");
      res.status(200).json({ message: "Agendamento criado com sucesso" });
    }
  });
});

//Deletar agendamento 
router.delete("/agendamento/:id/:status", (req, res) => {
  const idAgendamento = req.params.id;
  const status = req.params.status;

  const sql = `DELETE FROM AGENDAMENTO WHERE ID_AGENDAMENTO = '${idAgendamento}' AND STATUS = '${status}'`;
 
  //Deletando dado no banco de dados
  conexao.query(sql, (error, results) => {

    //Tratando erros
    if (error) {
      console.log("Erro ao deletar o agendamento");
      console.log(error.message);
      res.status(500).json({ message: "Erro ao deletar o agendamento" });
    } else if (results.affectedRows === 0) {
      console.log("Agendamento não encontrado");
      res.status(404).json({ message: "Agendamento não encontrado" });
    } else {
      console.log("Agendamento deletado com sucesso");
      res.status(200).json({ message: "Agendamento deletado com sucesso" });
    }
  });
});

module.exports = router;