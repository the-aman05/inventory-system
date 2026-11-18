const Product = require('../models/Product');

const httpError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// POST /api/products
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

// GET /api/products?category=&supplier=&search=&minPrice=&maxPrice=&sort=&page=&limit=
exports.getProducts = async (req, res, next) => {
  try {
    const { category, supplier, search, minPrice, maxPrice, sort } = req.query;

    // ---- Filtering ----
    const filter = {};
    if (category) filter.category = new RegExp(`^${escapeRegex(category)}$`, 'i');
    if (supplier) filter.supplier = new RegExp(`^${escapeRegex(supplier)}$`, 'i');
    if (search) filter.name = new RegExp(escapeRegex(search), 'i');
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // ---- Sorting: ?sort=price,-quantity  (default: newest first) ----
    const sortBy = sort ? sort.split(',').join(' ') : '-createdAt';

    // ---- Pagination ----
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
    const skip = (page - 1) * limit;

    const [total, products] = await Promise.all([
      Product.countDocuments(filter),
      Product.find(filter).sort(sortBy).skip(skip).limit(limit),
    ]);

    res.json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      count: products.length,
      products,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/products/:id
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) throw httpError('Product not found', 404);
    res.json(product);
  } catch (err) {
    next(err);
  }
};

// PUT /api/products/:id
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) throw httpError('Product not found', 404);
    res.json(product);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/products/:id/stock   body: { "change": 10 } or { "change": -5 }
// Positive = restock, negative = sale. Atomic: stock can never go below 0.
exports.adjustStock = async (req, res, next) => {
  try {
    const change = req.body.change;
    if (typeof change !== 'number' || !Number.isInteger(change) || change === 0) {
      throw httpError("'change' must be a non-zero whole number", 400);
    }

    const product = await Product.findOneAndUpdate(
      // for sales, only match if enough stock exists
      { _id: req.params.id, quantity: { $gte: change < 0 ? -change : 0 } },
      { $inc: { quantity: change } },
      { new: true }
    );

    if (!product) {
      const exists = await Product.exists({ _id: req.params.id });
      if (!exists) throw httpError('Product not found', 404);
      throw httpError('Insufficient stock for this sale', 400);
    }

    res.json({ message: 'Stock updated', product });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/products/:id
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) throw httpError('Product not found', 404);
    res.json({ message: 'Product deleted', id: product.id });
  } catch (err) {
    next(err);
  }
};

// GET /api/products/low-stock   (quantity <= reorderLevel)
exports.getLowStock = async (req, res, next) => {
  try {
    const lowStockItems = await Product.find({
      $expr: { $lte: ['$quantity', '$reorderLevel'] },
    }).sort('quantity');

    res.json({ count: lowStockItems.length, lowStockItems });
  } catch (err) {
    next(err);
  }
};

// GET /api/products/summary   (aggregation by category)
exports.getCategorySummary = async (req, res, next) => {
  try {
    const summary = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          totalItems: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' },
          totalStockValue: { $sum: { $multiply: ['$price', '$quantity'] } },
          avgPrice: { $avg: '$price' },
        },
      },
      { $sort: { totalStockValue: -1 } },
    ]);

    res.json({ categories: summary.length, summary });
  } catch (err) {
    next(err);
  }
};
