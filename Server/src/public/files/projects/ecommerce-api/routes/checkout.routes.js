const { Router } = require("express");
const router = Router();
router.post("/pay", (req, res) => {
  res.status(200).json({ success: true, txnId: "TXN_" + Date.now() });
});
module.exports = router;