const { Router } = require("express");
const router = Router();
const conexao = require("../infraestrutura/conexao");

//solicitar agendamento
router.post("/solicitar", (req, res) => {
  const id_fornecedor = req.body.id_fornecedor;
  const tipo_carga = req.body.tipo_carga;
  const tipo_descarga = req.body.tipo_descarga;
  const recorrencia = req.body.recorrencia;
  const observacao = req.body.observacao;
  const data_entrega = req.body.data;
  const hora_entrega  = req.body.horario;
  const status = 'P';

  const sql = ` INSERT INTO AGENDAMENTO (ID_AGENDAMENTO, ID_FORNECEDOR, TIPO_CARGA, TIPO_DESCARGA, RECORRENCIA, OBSERVACAO, HORA_ENTREGA, DATA_ENTREGA, STATUS) VALUES ('${idAgendamento}', '${id_fornecedor}', '${tipo_carga}', '${tipo_descarga}', '${recorrencia}', '${observacao}', '${hora_entrega}', '${data_entrega}', '${status}')`

  conexao.query(sql, (error, results) => {
    
    //Tratando erros
    if (error) {
      console.log("Erro ao criar a solicitação!");
      console.log(error.message);
      res.status(500).json({ message: "Erro ao criar a solicitação!" });
    } else if (results.changedRows === 0) {
      console.log("Agendamento não foi criado");
      res.status(404).json({ message: "A solicitação não foi criada!" });
    } else {
      console.log("Agendamento criado com sucesso");
      res.status(200).json({ message: "Solicitação criada com sucesso!" });
    }
  });
})


//delete agendamento
router.delete("/agendamentos/:id/:status", (req, res) => {
  const id_fornecedor = req.params.id;
  const status = req.params.status;
  
  const sql = 
  `
  DELETE FROM AGENDAMENTO WHERE ID_AGENDAMENTO = '${id_fornecedor}' AND STATUS = '${status}'
  `

  conexao.query(sql, (error, results) => {
    
    //Tratando erros
   if (error) {
      console.log("Erro ao deletar a solicitação!");
      console.log(error.message);
      res.status(500).json({ message: "Erro ao deletar a solicitação!" });
    } else if (results.affectedRows === 0) {
      console.log("Solicitação não encontrado!");
      res.status(404).json({ message: "Solicitação não encontrada!" });
    } else {
      console.log("Solicitação deletada com sucesso!");
      res.status(200).json({ message: "Solicitação deletada com sucesso!" });
    }
  });
});

module.exports = router;