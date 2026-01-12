const { createProductSchema, updateProductSchema } = require("./product.schema");
const productService = require("./product.service");

async function create(req, res, next) {
  try {
    const { value, error } = createProductSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const product = await productService.createProduct(value);
    return res.status(201).json({ product });
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const id = Number(req.params.id);
    const product = await productService.getProductById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    return res.json({ product });
  } catch (err) {
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const { page, limit, q } = req.query;
    const result = await productService.listProducts({ page, limit, q });
    return res.json(result);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { value, error } = updateProductSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const product = await productService.updateProduct(id, value);
    if (!product) return res.status(404).json({ message: "Product not found" });
    return res.json({ product });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const id = Number(req.params.id);
    const ok = await productService.deleteProduct(id);
    if (!ok) return res.status(404).json({ message: "Product not found" });
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { create, getOne, list, update, remove };
