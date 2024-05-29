const { Router } = require("express");
const router = Router();
const conexao = require("../infraestrutura/conexao");

//solicitar agendamento
router.post("/solicitar", (req, res) => {
  const idAgendamento = req.body.idAgendamento;
  const matricula_colaborador = req.body.matricula_colaborador;
  const cnpj = req.body.cnpj;
  const tipo_carga = req.body.tipo_carga;
  const tipo_descarga = req.body.tipo_descarga;
  const recorrencia = req.body.recorrencia;
  const observacao = req.body.observacao;
  const data_entrega = req.body.data;
  const hora_entrega = req.body.horario;
  const status = "P";

  const sql = ` INSERT INTO AGENDAMENTO (ID_AGENDAMENTO, CNPJ, TIPO_CARGA, TIPO_DESCARGA, RECORRENCIA, OBSERVACAO, HORA_ENTREGA, DATA_ENTREGA, STATUS) VALUES ('${idAgendamento}', '${cnpj}', '${tipo_carga}', '${tipo_descarga}', '${recorrencia}', '${observacao}', '${hora_entrega}', '${data_entrega}', '${status}')`;

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
      logColaborador("solicitar", matricula_colaborador, cnpj, idAgendamento)
    }
  });
});


//delete agendamento
router.delete("/delete/:id/:status", (req, res) => {
  const cnpj = req.params.id;
  const status = req.params.status;

  const sql = 
  `
  DELETE FROM AGENDAMENTO WHERE ID_AGENDAMENTO = '${cnpj}' AND STATUS = '${status}'
  `;
  
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

//Ler agendamentos pendentes
router.get("/pendentes", (req, res) => {
  const sql = `
  SELECT * FROM AGENDAMENTO WHERE STATUS = P
  `;
  
  conexao.query(sql, (erro, result) => {
    if (err) {
      console.log("Erro ao consultar tabela!");
      console.log(error.message);
      res.status(500).json({ message: "Erro ao consultar tabela!" });
    } else {
      console.log("Tabela consultada com sucesso!");
      res.status(200).json({ message: "Tabela consultada com sucesso!" });
      res.json(result);
    }
  });
});

//Ler agendamentos finalizados
router.get("/finalizados", (req, res) => {
  const sql = `
  SELECT * FROM AGENDAMENTO WHERE STATUS = F
  `;
  
  conexao.query(sql, (erro, result) => {
    if (err) {
      console.log("Erro ao consultar tabela!");
      console.log(error.message);
      res.status(500).json({ message: "Erro ao consultar tabela!" });
    } else {
      console.log("Tabela consultada com sucesso!");
      res.status(200).json({ message: "Tabela consultada com sucesso!" });
      res.json(result);
    }
  });
});

//resposta
router.put("/resposta", (req, res) => {
  if (req.body.resposta === "aceitar") {
    const idAgendamento = req.body.idAgendamento
    sql = 
    `
    UPDATE AGENDAMENTO SET
    STATUS = A WHERE ID_AGENDAMENTO = '${idAgendamento}'
    `
    conexao.query(log, (error, result) => {
      if (error) {
        console.log("Erro ao aceitar!");
        console.log(error.message);
        res.status(500).json({ message: "Erro ao aceitar!" });
      } else {
        console.log("Aceitado!");
        res.status(200).json({ message: "Aceite realizado com sucesso!" });
        res.json(result);
      }
    });
  } else if (req.body.resposta === "recusar") {
    const idAgendamento = req.body.idAgendamento
    sql = 
    `
    UPDATE AGENDAMENTO SET
    STATUS = R WHERE ID_AGENDAMENTO = '${idAgendamento}'
    `
    
    conexao.query(log, (error, result) => {
      if (error) {
        console.log("Erro ao recusar!");
        console.log(error.message);
        res.status(500).json({ message: "Erro ao recusar!" });
      } else {
        console.log("Recusado!");
        res.status(200).json({ message: "Recusa realizada com sucesso!" });
        res.json(result);
      }
    });
  } else if (req.body.resposta === "finalizado") {
    const idAgendamento = req.body.idAgendamento
    sql = 
    `
    UPDATE AGENDAMENTO SET
    STATUS = F WHERE ID_AGENDAMENTO = '${idAgendamento}'
    `

    conexao.query(log, (error, result) => {
      if (error) {
        console.log("Erro ao finalizar!");
        console.log(error.message);
        res.status(500).json({ message: "Erro ao finalizar agendamento!" });
      } else {
        console.log("Finalizado!");
        res.status(200).json({ message: "Agendamento finalizado com sucesso!" });
        res.json(result);
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
    SELECT * FROM FORNECEDOR WHERE MATRICULA = "${matricula}" AND SENHA = "${senha}"; 
    `;
    conexao.query(sql, (error, result) => {
      if (result.length > 0) {
        for (let i = 0; i < result.length; i++) {
          if (result[i].senha == this.senha) {
            req.session.matricula = result[i].matricula;
            res.status(200).json({ message: "Login efetuado com sucesso!" });
            res.json(result);
            res.redirect("/");
          } else {
            console.log(error.message);
            res.status(500).json({ message: "Matrícula ou senha inválido" });
            res.status("");
          }
        }
      } else {
        res.status(500).json({ message: "Matrícula ou senha inválido" });
      }
      res.end();
    });
  } else {
    res.send("Insira um Id e uma senha válida");
    res.end();
  }
});


// Inserindo modificações na tabela log
function logColaborador(action, matricula, cnpj, idAgendamento) {
  if (action === "solicitar") {
    log = 
    `
    INSERT INTO LOG (TIPO, MATRICULA_COLABORADOR, CNPJ, ID_AGENDAMENTO, DATA_CRIACAO)
    VALUES ( ${action}, '${matricula}, ${cnpj}, ${idAgendamento}, CURRENT_TIMESTAMP')
    `
    conexao.query(log, (error, result) => {
      if (error) {
        console.log("Erro ao solicitar!");
        console.log(error.message);
        res.status(500).json({ message: "Erro ao solicitar!" });
      } else {
        console.log("Solicitado!");
        res.status(200).json({ message: "Solicitação realizada com sucesso!" });
        res.json(result);
      }
    });

  } else if (action === "deletar") {
    log = 
    `
    INSERT INTO LOG (TIPO, MATRICULA_COLABORADOR, CNPJ, ID_AGENDAMENTO, DATA_CRIACAO)
    VALUES ( ${action}, '${matricula}, ${cnpj}, ${idAgendamento}, CURRENT_TIMESTAMP')
    `

  conexao.query(log, (error, result) => {
    if (error) {
      console.log("Erro ao registrar o delete na tabela log!");
      console.log(error.message);
      res.status(500).json({ message: "Erro ao registrar o delete na tabela log!" });
    } else {
      console.log("Deletado!");
      res.status(200).json({ message: "Registro realizado com sucesso!" });
      res.json(result);
    }
  });
  } else if (action === "modificar") {
    log - 
    `
    UPDATE AGENDAMENTO SET
    CNPJ = '${cnpj}',
    TIPO_CARGA = '${tipo_carga}',
    TIPO_DESCARGA = '${tipo_descarga}',
    RECORRENCIA = '${recorrencia}',
    OBSERVACAO = '${observacao}',
    HORA_ENTREGA = '${hora_entrega}',
    DATA_ENTREGA = '${data_entrega}'  WHERE ID_AGENDAMENTO = ${idAgendamento} 
    `

    conexao.query(log, (error, result) => {
      if (error) {
        console.log("Erro ao registrar na tabela log!");
        console.log(error.message);
        res.status(500).json({ message: "Erro ao registrar na tabela log!" });
      } else {
        console.log("Modificado!");
        res.status(200).json({ message: "Registrado com sucesso!" });
        res.json(result);
      }
    });
  }
}


module.exports = router;
