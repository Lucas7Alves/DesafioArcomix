const { Router } = require("express");
const router = Router();
const conexao = require("../infraestrutura/conexao");

//Criar agendamento
router.post("/agendamento/criar", (req, res) => {
 
  //Dados do agendamento
  const cnpj = req.body.cnpj;
  const idAgendamento = req.body.idAgendamento;
  const matricula_colaborador = null; // porque não se faz necessário na solicitação
  const tipo_carga = req.body.tipo_cacarga;
  const tipo_descarga = req.body.tipo_descarga;
  const recorrencia = req.body.recorrencia;
  const observacao = req.body.observacao;
  const hora_entrega = req.body.hora_entrega;
  const data_entrega = req.body.data_entrega;
  const status = 'P';

  //Comando para inserir os dados no banco de dados
  const sql = `INSERT INTO AGENDAMENTO (CNPJ, ID_AGENDAMENTO, MATRICULA_COLABORADOR, TIPO_CARGA, TIPO_DESCARGA, RECORRENCIA, OBSERVACAO, HORA_ENTREGA, DATA_ENTREGA, STATUS) VALUES ('${cnpj}', '${idAgendamento}', '${matricula_colaborador}', '${tipo_carga}', '${tipo_descarga}', '${recorrencia}', '${observacao}', '${hora_entrega}', '${data_entrega}', '${status}')`;

  //Inserindo dados no banco de dados
  conexao.query(sql, (error, results) => {
    
    //Tratando erros
    if (error) {
      console.log("Erro ao criar o agendamento!");
      console.log(error.message);
      res.status(500).json({ message: "Erro ao criar o agendamento!" });
    } else if (results.changedRows === 0) {
      console.log("Agendamento não foi criado");
      res.status(404).json({ message: "Agendamento não foi criado!" });
    } else {
      console.log("Agendamento criado com sucesso!");
      res.status(200).json({ message: "Agendamento criado com sucesso!" });
    }
  });
});

//Deletar agendamento 
router.delete("/deletar/:matricula_colaborador/:status/:cnpj/:idAgendamento", (req, res) => {
  const idAgendamento = req.params.idAgendamento
  const cnpj = req.params.id;
  const status = req.params.status;
  matricula_colaborador = req.params.matricula_colaborador;

  const sql = `DELETE FROM AGENDAMENTO WHERE ID_AGENDAMENTO = '${idAgendamento}' AND STATUS = '${status}' AND CNPJ = '${cnpj} AND MATRICULA_COLABORADOR = NULL'`;
 
  //Deletando dado no banco de dados
  conexao.query(sql, (error, results) => {

    //Tratando erros
    if (error) {
      console.log("Erro ao deletar o agendamento!");
      console.log(error.message);
      res.status(500).json({ message: "Erro ao deletar o agendamento!" });
    } else if (results.affectedRows === 0) {
      console.log("Agendamento não encontrado!");
      res.status(404).json({ message: "Agendamento não encontrado!" });
    } else {
      console.log("Agendamento deletado com sucesso!");
      res.status(200).json({ message: "Agendamento deletado com sucesso!" });
    }
  });
});

//Ler agendamentos pendentes
router.get("/pendente/:cnpj", (req, res) => {
  const cnpj = req.params.cnpj;

  const sql = 
  `
  SELECT * FROM AGENDAMENTO WHERE STATUS = P AND CNPJ = '${cnpj}'
  `

  conexao.query(sql, (erro, result) => {
    if (err) {
      console.log("Erro ao consultar tabela!");
      console.log(error.message);
      res.status(500).json({ message: "Erro ao consultar tabela!"
      });
    } else {
      console.log("Tabela consultada com sucesso!");
      res.status(200).json({ message: "Tabela consultada com sucesso!" 
      });
      res.jason(result);
    }
  })
})

//Ler agendamentos finalizados
router.get("/finalizados/:cnpj", (req, res) => {
  const cnpj = req.params.cnpj;

  const sql = 
  `
  SELECT * FROM AGENDAMENTO WHERE STATUS = F AND CNPJ = '${cnpj}'
  `

  conexao.query(sql, (erro, result) => {
    if (err) {
      console.log("Erro ao consultar tabela!");
      console.log(error.message);
      res.status(500).json({ message: "Erro ao consultar tabela!"
      });
    } else {
      console.log("Tabela consultada com sucesso!");
      res.status(200).json({ message: "Tabela consultada com sucesso!" 
      });
      res.jason(result);
    }
  })
})

module.exports = router;