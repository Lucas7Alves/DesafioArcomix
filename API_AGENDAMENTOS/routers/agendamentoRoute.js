const { Router } = require("express");
const router = Router();

//create agendamento
router.put("/agendamentos", (req, res) => {
  res.send("Listando os agendamentos");
});

//delete agendamento
router.delete("/agendamentos/:id", (req, res) => {
  res.send("Listando os agendamentos");
});


module.exports = router;