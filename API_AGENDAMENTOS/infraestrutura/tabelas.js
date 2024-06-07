class Tabelas {
  init(conexao) {
    this.conexao = conexao;
    this.criarTabelaAgendamentos();
    this.criarTabelaColaborador();
    this.criarTabelaFornecedor();
    this.criarTabelaLog();
    this.criarTabelaLogFornecedor();
  }

  criarTabelaColaborador() {
    const sql = 
    `
    CREATE TABLE IF NOT EXISTS COLABORADOR (
      MATRICULA_COLABORADOR CHAR(6) PRIMARY KEY,
      NOME_COLABORADOR VARCHAR(40) NOT NULL,
      EMAIL_COLABORADOR VARCHAR(30) NOT NULL,
      SENHA_COLABORADOR VARCHAR(8) NOT NULL
     );
    `;

    this.conexao.query(sql, (error) => {
      if(error) {
        console.log("Erro ao criar a tabela")
        console.log(error.message);
        return;
      }
      console.log("Tabela criada")
    });
  }

  criarTabelaFornecedor() {
    const sql = 
    `
    CREATE TABLE IF NOT EXISTS FORNECEDOR (
      CNPJ CHAR(14) PRIMARY KEY,
      RAZAO_SOCIAL VARCHAR(20) NOT NULL,
      NOME_FANTASIA VARCHAR(20) NOT NULL,
      ID_FORNECEDOR CHAR(20) NOT NULL,
      SENHA_FORNECEDOR VARCHAR(8) NOT NULL,
      INFORMACAO_LEGAL VARCHAR(100)
  );  
    `;

    this.conexao.query(sql, (error) => {
      if(error) {
        console.log("Erro ao criar a tabela")
        console.log(error.message);
        return;
      }
      console.log("Tabela criada")
    });
  }

  criarTabelaLog() {
    const sql = 
    `
    CREATE TABLE IF NOT EXISTS LOG (
      TIPO VARCHAR(10),
      ID_AGENDAMENTO CHAR(6) PRIMARY KEY,
      MATRICULA_COLABORADOR CHAR(6) NOT NULL,
      DATA_OCORRENCIA DATE,
      FOREIGN KEY (ID_AGENDAMENTO) REFERENCES AGENDAMENTO(ID_AGENDAMENTO),
      FOREIGN KEY (MATRICULA_COLABORADOR) REFERENCES COLABORADOR(MATRICULA_COLABORADOR)
  );
    `;

    this.conexao.query(sql, (error) => {
      if(error) {
        console.log("Erro ao criar a tabela")
        console.log(error.message);
        return;
      }
      console.log("Tabela criada")
    });
  }

  criarTabelaLogFornecedor() {
    const sql = 
    `
    CREATE TABLE IF NOT EXISTS LOG_FORNECEDOR (
      ID_LOG INT AUTO_INCREMENT PRIMARY KEY,
      TIPO VARCHAR(10),
      ID_AGENDAMENTO CHAR(6),
      CNPJ CHAR(14),
      DATA_OCORRENCIA DATE,
      FOREIGN KEY (CNPJ) REFERENCES FORNECEDOR(CNPJ)
  );
    `;

    this.conexao.query(sql, (error) => {
      if(error) {
        console.log("Erro ao criar a tabela")
        console.log(error.message);
        return;
      }
      console.log("Tabela criada")
    });
  }


  criarTabelaAgendamentos() {
    const sql = 
    `
    CREATE TABLE IF NOT EXISTS AGENDAMENTO (
      ID_AGENDAMENTO CHAR(6) PRIMARY KEY,
      MATRICULA_COLABORADOR CHAR(6),
      CNPJ CHAR(14) NOT NULL,
      TIPO_CARGA VARCHAR(10) NOT NULL,
      TIPO_DESCARGA VARCHAR(10) NOT NULL,
      RECORRENCIA VARCHAR(10) NOT NULL,
      OBSERVACAO VARCHAR(50),
      HORA_ENTREGA TIME NOT NULL,
      DATA_ENTREGA DATE NOT NULL,
      STATUS CHAR(1) NOT NULL,
      FOREIGN KEY (MATRICULA_COLABORADOR) REFERENCES COLABORADOR(MATRICULA_COLABORADOR),
      FOREIGN KEY (CNPJ) REFERENCES FORNECEDOR(CNPJ)
    );
    
    `;
    this.conexao.query(sql, (error) => {
      if(error) {
        console.log("Erro ao criar a tabela")
        console.log(error.message);
        return;
      }
      console.log("Tabela criada")
    });
    
  }
}

module.exports = new Tabelas();