const routerColaborador = require("./ColaboradorRoute");
const routerFornecedor = require("./FornecedorRoute"); 
module.exports = (app) => {
  app.use(routerColaborador);
  app.use(routerFornecedor); 
};


