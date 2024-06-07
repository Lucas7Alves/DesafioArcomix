const { Router } = require("express");
const router = Router();
const conexao = require("../infraestrutura/conexao");

//Criar agendamento
router.post("/fornecedor/criar", (req, res) => {
  //Dados do agendamento
  const cnpj = req.body.cnpj;
  const idAgendamento = req.body.idAgendamento;
  const matricula_colaborador = null; // porque não se faz necessário na solicitação
  const tipo_carga = req.body.tipo_carga;
  const tipo_descarga = req.body.tipo_descarga;
  const recorrencia = req.body.recorrencia;
  const observacao = req.body.observacao;
  const hora_entrega = req.body.hora_entrega;
  const data_entrega = req.body.data_entrega;
  const status = "P";
  const action = 'criar'

  //Comando para inserir os dados no banco de dados
  const sql = `INSERT INTO AGENDAMENTO (CNPJ, ID_AGENDAMENTO, TIPO_CARGA, TIPO_DESCARGA, RECORRENCIA, OBSERVACAO, HORA_ENTREGA, DATA_ENTREGA, STATUS) VALUES ('${cnpj}', '${idAgendamento}', '${tipo_carga}', '${tipo_descarga}', '${recorrencia}', '${observacao}', '${hora_entrega}', '${data_entrega}', '${status}')`;

  //Inserindo dados no banco de dados
  conexao.query(sql, (error, result) => {
    //Tratando erros
    if (error) {
      console.log(res.changedRows);
      console.log("Erro ao criar o agendamento!");
      console.log(error.message);
      res.status(500).json({ message: "Erro ao criar o agendamento!!" });
    } else if (result.affectedRows === 0) {
      console.log(result.affectedRows);
      console.log("Agendamento não foi criado");
      res.status(404).json({ message: "Agendamento não foi criado!" });
    } else {
      logFornecedor(action, idAgendamento, cnpj);
      console.log("Agendamento criado com sucesso!");
      res.status(200).json({ message: "Agendamento criado com sucesso!" });
    }
  });
});

//Deletar agendamento
router.delete("/fornecedor/deletar",(req, res) => {
    const idAgendamento = req.body.idAgendamento;
    const cnpj = req.body.cnpj;
    const action = 'deletar'
    const status = 'P';

    const sql = `DELETE FROM AGENDAMENTO WHERE ID_AGENDAMENTO = '${idAgendamento}' AND STATUS = '${status}' AND CNPJ = '${cnpj}'`;
    
    
    //Deletando dado no banco de dados
    conexao.query(sql, (error, results) => {
      //Tratando erros
      if (error) {
        console.log("Erro ao deletar o agendamento!");
        console.log(error.message);
        res.status(500).json({ message: "Erro ao deletar o agendamento!" });
      } else if (results.affectedRows === 0) {
        console.log("Agendamento não encontrado!");
        res.status(404).json({ message: "Não há agendamento pendentes a ser deletado com esse ID!" });
      } else {
        logFornecedor(action, idAgendamento, cnpj);
        console.log("Agendamento deletado com sucesso!");
        res.status(200).json({ message: "Agendamento deletado com sucesso!" });
      }
    });
  }
);

//Ler agendamentos pendentes
router.get("/fornecedor/pendente", (req, res) => {
  const cnpj = req.body.cnpj;

  const sql = `
  SELECT * FROM AGENDAMENTO WHERE STATUS = 'P' AND CNPJ = '${cnpj}'
  `;

  conexao.query(sql, (error, result) => {
    if (error) {
      console.log("Erro ao consultar tabela!");
      console.log(error.message);
      res.status(500).json({ message: "Erro ao consultar tabela!" });
    } else {
      console.log("Tabela consultada com sucesso!");
      res.status(200).json({ message: "Tabela consultada com sucesso!", data: result });
    }
  });
});

//Ler agendamentos finalizados
router.get("/fornecedor/finalizados", (req, res) => {
  const idAgendamento = req.body.idAgendamento;
  const cnpj = req.body.cnpj;
  const action = 'deletar'

  const sql = `
  SELECT * FROM AGENDAMENTO WHERE STATUS = 'F' AND CNPJ = '${cnpj}'
  `;

  conexao.query(sql, (error, result) => {
    if (error) {
      console.log("Erro ao consultar tabela!");
      console.log(error.message);
      res.status(500).json({ message: "Erro ao consultar tabela!" });
    } else {
      console.log("Tabela consultada com sucesso!");
      res.status(200).json({ message: "Tabela consultada com sucesso!", data: result });
    }
  });
});

//resposta
router.put("/fornecedor/resposta", (req, res) => {
  const resposta = req.body.resposta;
  const idAgendamento = req.body.idAgendamento;
  const cnpj = req.body.cnpj;
  
  if (resposta === "recusar") {

    const action = 'recusado'

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
        logFornecedor(action, idAgendamento, cnpj);
        console.log("Recusado!");
        res.status(200).json({ message: "Recusa realizada com sucesso!" });
      }
    });
  } else {

    const action = 'aceitado'

    sql = `
    UPDATE AGENDAMENTO SET
    STATUS = 'A' WHERE ID_AGENDAMENTO = '${idAgendamento}'
    `;

    conexao.query(sql, (error, result) => {
      if (error) {
        console.log("Erro ao aceitar!");
        console.log(error.message);
        res.status(500).json({ message: "Erro ao aceitar!" });
      } else {
        logFornecedor(action, idAgendamento, cnpj);
        console.log("Aceitado!");
        res.status(200).json({ message: "Aceite realizado com sucesso!" });
      }
    });
  }
});

//login
router.post("/fornecedor/login", (req, res) => {
  const id_fornecedor = req.body.id_fornecedor;
  const senha = req.body.senha;

  if (id_fornecedor && senha) {
    const sql = `
    SELECT * FROM FORNECEDOR WHERE ID_FORNECEDOR = '${id_fornecedor}' AND SENHA_FORNECEDOR = '${senha}'; 
    `;
    conexao.query(sql, (error, result) => {
      console.log(result)
      if (result.length > 0) {
          if (result[0].SENHA_FORNECEDOR === senha) {
            res.status(200).json({ message: "Login efetuado com sucesso!" });
          } else {
            res.status(500).json({ message: "Id ou senha inválido", data: result });
          }
      } else {
        res.status(500).json({ message: "Id ou senha inválido" });
      }
    });
  } else {
    res
      .status(400)
      .json({ message: "Insira um Id e uma senha válida" });
  }
});

function logFornecedor(action, idAgendamento, cnpj) {

  const log = `
    INSERT INTO LOG_FORNECEDOR (TIPO, ID_AGENDAMENTO, CNPJ, DATA_OCORRENCIA)
    VALUES ('${action}', '${idAgendamento}', '${cnpj}', CURRENT_TIMESTAMP)
  `;

  conexao.query(log, (error, result) => {
    if (error) {
      console.log("Erro ao registrar na tabela logFornecedor!");
      console.log(error.message);
    } else {
      console.log("Solicitado!");
    }
  });
}


module.exports = router;
