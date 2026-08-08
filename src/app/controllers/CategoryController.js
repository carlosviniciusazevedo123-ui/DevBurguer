import * as Yup from 'yup';
import Category from '../models/Category.js';


class CategoryController {
  async store(request, response) {
    const schema = Yup.object({
      name: Yup.string().required(),
    });
    try {
      schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const { name } = request.body;
    const { filename } = request.file;

    const existingCategory = await Category.findOne({
      where: {
        name,
      },
    });

    if (existingCategory) {
      return response.status(400).json({ error: 'Category already exists.' });
    }

    const newCategory = await Category.create({
      name,
      path: filename,
    });
    return response.status(200).json(newCategory);
  }

  async update(request, response) {
  const schema = Yup.object({
    name: Yup.string(),
  });

  try {
    schema.validateSync(request.body, { abortEarly: false });
  } catch (err) {
    return response.status(400).json({ error: err.errors });
  }

  const { id } = request.params;
  const { name } = request.body;

  const category = await Category.findByPk(id);

  if (!category) {
    return response.status(404).json({
      error: 'Category not found.',
    });
  }

  if (name) {
    const existingCategory = await Category.findOne({
      where: { name },
    });

    if (existingCategory && existingCategory.id !== category.id) {
      return response.status(400).json({
        error: 'Category already exists.',
      });
    }
  }

  const updateData = {};

  if (name !== undefined) {
    updateData.name = name;
  }

  if (request.file) {
    updateData.path = request.file.filename;
  }

  await category.update(updateData);

  return response.status(200).json(category);
}
  async index(_request, response) {
    const categories = await Category.findAll();

    return response.status(200).json(categories);
  }
}

export default new CategoryController();
