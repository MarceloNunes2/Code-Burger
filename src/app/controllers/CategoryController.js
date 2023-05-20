import * as Yup from 'yup';
import Category from '../models/Category';

class CategoryController {
  async store(request, response) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required(),
      });

      await schema.validate(request.body, { abortEarly: false });

      const { name } = request.body;

      const categoryExists = await Category.findOne({
        where:{
          name,
        },
      })
      if(categoryExists){
        return response.status(400).json({error:"Categoria ja existente"})
      }
      const {id} = await Category.create({name,});

      return response.json({ name,id })
    } catch (err) {
      console.log(err);
      return response.status(400).json({ error: err.errors });
    }
  }

  async index(request, response) {
    try {
      const category = await Category.findAll();
      console.log(request.userId);
      return response.json(category);
    } catch (err) {
      console.log(err);
      return response.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default new CategoryController();
