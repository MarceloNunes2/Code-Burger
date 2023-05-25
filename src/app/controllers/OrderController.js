
import * as Yup from 'yup'
import Product from '../models/Product'
import Category from '../models/Category'
import  Order  from '../schemas/Order'

class OrderController{

    async store(request,response){
        const schema = Yup.object().shape({
            products: Yup.array().required().of(
                Yup.object().shape({
                    id: Yup.number().required(),
                    quantity: Yup.number().required(),
                })
            ),
           
        })
        console.log(request)
        try{
            await schema.validateSync(request.body,{abortEarly: false})
        }catch(err){
           return response.status(400).json({error: err.errors})
        }
 
        const productsId = request.body.products.map( product => product.id)

        const updateProducts = await Product.findAll({
            where:{
                id:productsId,
            },
            include:[
                {
                    model: Category,
                    as: 'category',
                    attributes:['name']
                }
            ]
        })

        const editedProduct = updateProducts.map(product => {

            const productsIndex = request.body.products.findIndex
            (requestProduct => requestProduct.id === product.id)


            const newProduct = {
                id: product.id,
                name: product.name,
                price: product.price,
                category: product.category.name,
                url:product.url,
                quantity:request.body.products[productsIndex].quantity,
            }

            return newProduct
        })

        const order = {
            user:{
                id:request.userId,
                name:request.userName,
            },
            products: editedProduct,
            status: 'Pedido Realizado',
        }

          const orderResponse = await Order.create(order)

        return response.status(201).json(orderResponse)
    }

    async index(request,response){
        const orders = await Order.find()

        return response.json(orders)
    }
}

export default new OrderController ()