const { Router } = require("express");
const router = Router();
const conexao = require("../infraestrutura/conexao");

//delete agendamento
router.delete("/agendamentos/:id", (req, res) => {
  res.destroy({where: {'id': req.params.id}}).then(function() {
    res.send("Deletado!")
  }).catch(function(erro) {
    res.send("Não existe esse ID!")
  });
});


module.exports = router;