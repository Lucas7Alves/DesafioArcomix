const { Router } = require("express");
const router = Router();
const conexao = require("../infraestrutura/conexao");
const { act } = require("react");

//solicitar agendamento
router.post("/solicitar", (req, res) => {
  const idAgendamento = req.body.idAgendamento;
  const matricula_colaborador = req.body.matricula_colaborador;
  const cnpj = req.body.cnpj;
  const tipo_carga = req.body.tipo_carga;
  const tipo_descarga = req.body.tipo_descarga;
  const recorrencia = req.body.recorrencia;
  const observacao = req.body.observacao;
  const data_entrega = req.body.data_entrega;
  const hora_entrega = req.body.hora_entrega;
  const status = "P";

  const sql = ` INSERT INTO AGENDAMENTO (ID_AGENDAMENTO, CNPJ, MATRICULA_COLABORADOR, TIPO_CARGA, TIPO_DESCARGA, RECORRENCIA, OBSERVACAO, HORA_ENTREGA, DATA_ENTREGA, STATUS) VALUES ('${idAgendamento}', '${cnpj}', '${matricula_colaborador}', '${tipo_carga}', '${tipo_descarga}', '${recorrencia}', '${observacao}', '${hora_entrega}', '${data_entrega}', '${status}')`;

  conexao.query(sql, (error, result) => {
    //Tratando erros
    if (error) {
      res
        .status(500)
        .json({ message: "Erro ao criar a solicitação: " + error });
    } else if (result.affectedRows === 0) {
      res.status(200).json({ message: "A solicitação não foi criada!" });
    } else {
      res.status(200).json({ message: "Solicitação criada com sucesso!" });
      logColaborador("solicitar", matricula_colaborador, idAgendamento);
    }
  });
});

//delete agendamento
router.delete("/delete", (req, res) => {
  const idAgendamento = req.body.id;
  const status = req.body.status;

  const sql = `
  DELETE FROM AGENDAMENTO WHERE ID_AGENDAMENTO = '${idAgendamento}' AND STATUS = '${status}'
  `;

  conexao.query(sql, (error, result) => {
    //Tratando erros
    if (error) {
      console.log("Erro ao deletar a solicitação!");
      console.log(error.message);
      res.status(500).json({ message: "Erro ao deletar a solicitação!" });
    } else if (result.affectedRows === 0) {
      console.log("Solicitação não encontrado!");
      res.status(404).json({ message: "Solicitação não encontrada!" });
    } else {
      console.log("Solicitação deletada com sucesso!");
      res.status(200).json({ message: "Solicitação deletada com sucesso!" });
    }
  });
});

//Ler agendamentos pendentes
router.get("/pendentes", (req, res) => {
  const sql = `
  SELECT * FROM AGENDAMENTO WHERE STATUS = 'P'
  `;

  conexao.query(sql, (error, result) => {
    if (error) {
      console.log("Erro ao consultar tabela!");
      console.log(error.message);
      res.status(500).json({ message: "Erro ao consultar tabela!" });
    } else {
      console.log("Tabela consultada com sucesso!");
      res
        .status(200)
        .json({ message: "Tabela consultada com sucesso!", data: result });
    }
  });
});

//Ler agendamentos finalizados
router.get("/finalizados", (req, res) => {
  const sql = `
  SELECT * FROM AGENDAMENTO WHERE STATUS = 'F'
  `;

  conexao.query(sql, (error, result) => {
    if (error) {
      console.log("Erro ao consultar tabela!");
      console.log(error.message);
      res.status(500).json({ message: "Erro ao consultar tabela!" });
    } else {
      console.log("Tabela consultada com sucesso!");
      res
        .status(200)
        .json({ message: "Tabela consultada com sucesso!", data: result });
    }
  });
});

//resposta
router.put("/resposta", (req, res) => {
  const resposta = req.body.resposta;
  const idAgendamento = req.body.idAgendamento;
  const matricula_colaborador = req.body.matricula_colaborador;
  if (resposta === "aceitar") {
    sql = `
    UPDATE AGENDAMENTO SET STATUS = 'A' WHERE ID_AGENDAMENTO = '${idAgendamento}'
    `;
    conexao.query(sql, (error, response) => {
      if (error) {
        console.log("Erro ao aceitar!");
        console.log(error.message);
        res.status(500).json({ message: "Erro ao aceitar!" });
      } else {
        console.log("Aceitado!");
        logColaborador(resposta, matricula_colaborador, idAgendamento);
        res.status(200).json({ message: "Aceite realizado com sucesso!" }); //
      }
    });
  } else if (resposta === "recusar") {
    const idAgendamento = req.body.idAgendamento;
    sql = `
    UPDATE AGENDAMENTO SET
    STATUS = 'R' WHERE ID_AGENDAMENTO = '${idAgendamento}'
    `;

    conexao.query(sql, (error, result) => {
      if (error) {
        console.log("Erro ao recusar!");
        console.log(error.message);
        res.status(500).json({ message: "Erro ao recusar!" });
      } else {
        console.log("Recusado!");
        logColaborador(resposta, matricula_colaborador, idAgendamento);
        res.status(200).json({ message: "Recusa realizada com sucesso!" });
      }
    });
  } else if (resposta === "finalizar") {
    const idAgendamento = req.body.idAgendamento;
    sql = `
    UPDATE AGENDAMENTO SET
    STATUS = 'F' WHERE ID_AGENDAMENTO = '${idAgendamento}'
    `;

    conexao.query(sql, (error, result) => {
      if (error) {
        console.log("Erro ao finalizar!");
        console.log(error.message);
        res.status(500).json({ message: "Erro ao finalizar agendamento!" });
      } else {
        console.log("Finalizado!");
        res
          .status(200)
          .json({ message: "Agendamento finalizado com sucesso!" });
        logColaborador(resposta, matricula_colaborador, idAgendamento);
      }
    });
  }
});

//Login
router.post("/loginColaborador", (req, res) => {
  const matricula = req.body.matricula;
  const senha = req.body.senha;

  if (matricula && senha) {
    const sql = `
    SELECT * FROM COLABORADOR WHERE MATRICULA_COLABORADOR = '${matricula}' AND SENHA_COLABORADOR = '${senha}'; 
    `;
    conexao.query(sql, (error, result) => {
      if (result.length > 0) {
        if (result[0].SENHA_COLABORADOR === senha) {
          res.status(200).json({ message: "Login efetuado com sucesso!" });
        } else {
          res.status(500).json({ message: "Matrícula ou senha inválido" });
        }
      } else {
        res.status(500).json({ message: "Matrícula ou senha inválido" });
      }
    });
  } else {
    res
      .status(400)
      .json({ message: "Insira uma matrícula e uma senha válida" });
  }
});

// Inserindo modificações na tabela log
function logColaborador(action, matricula, idAgendamento) {
  const log = `
    INSERT INTO LOG (TIPO, MATRICULA_COLABORADOR, ID_AGENDAMENTO, DATA_OCORRENCIA)
    VALUES ('${action}', '${matricula}', '${idAgendamento}', CURRENT_TIMESTAMP)
  `;

  conexao.query(log, (error, result) => {
    if (error) {
      console.log("Erro ao registrar na tabela log!");
      console.log(error.message);
    } else {
      console.log("Solicitado!");
    }
  });
}

module.exports = router;
