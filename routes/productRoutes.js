const express = require('express');
const c = require('../controllers/productController');
const validateObjectId = require('../middleware/validateObjectId');

const router = express.Router();

router.route('/').post(c.createProduct).get(c.getProducts);

// IMPORTANT: static routes must come BEFORE '/:id',
// otherwise Express treats "low-stock" / "summary" as an id.
router.get('/low-stock', c.getLowStock);
router.get('/summary', c.getCategorySummary);

router
  .route('/:id')
  .get(validateObjectId, c.getProductById)
  .put(validateObjectId, c.updateProduct)
  .delete(validateObjectId, c.deleteProduct);

router.patch('/:id/stock', validateObjectId, c.adjustStock);

module.exports = router;
