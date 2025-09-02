const validate = (schema) => async (req, res, next) => {
  try {
    const parseBody = await schema.parseAsync(req.body);
    req.body = parseBody;
    next();
  } catch (error) {
    if (error.errors) {
      return res.status(400).json({
        msg: error.errors.map(err => ({
          field: err.path.join("."),
          message: err.message
        }))
      });
    }
    res.status(400).json({ msg: error.message || "Validation failed" });
  }
};

module.exports = validate;
