class Tabelas {
  init(conexao) {
    this.conexao = conexao;
    this.criarTabelaAgendamentos();
  }

  criarTabelaAgendamentos() {
    const sql = 
    `
    CREATE TABLE IF NOT EXISTS AGENDAMENTO (
      ID_AGENDAMENTO CHAR(6) PRIMARY KEY,
      MATRICULA_COLABORADOR CHAR(6) NOT NULL,
      CNPJ CHAR(11) NOT NULL,
      TIPO_DESCARGA VARCHAR(10) NOT NULL,
      RECORRENCIA VARCHAR(10) NOT NULL,
      OBSERVACAO VARCHAR(50),
      HORA_ENTREGA TIME NOT NULL,
      DATA_ENTREGA DATE NOT NULL,
      STATUS TINYINT(1) NOT NULL,
      TIPO_CARGA VARCHAR(10) NOT NULL,
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