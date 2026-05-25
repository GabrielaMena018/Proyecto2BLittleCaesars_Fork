import cartModel from "../models/cart.js";

import pizzasModel from "../models/pizzas.js";

const cartController = {}

//Select
cartController.getAllCarts = async (req, res) => {
    try {
        //Populate nos sirve para traer datos referentes a un Id de otra colección
        //-_password
        const carts = await cartModel.find()
        .populate("customerId", "name email")
        .populate("productId", "name price")

        return res.status(200).json(carts)
    } catch (error) {
        console.log("error" + error)
        return res.status(500).json({message: "Internal server error"})
    }
};

//INSERT
cartController.insertCart = async (req, res) => {
    try {
        
        //#1 - Solicito los datos
        const {customerId, products, status} = req.body

        //Variable para guardar el total
        let total = 0

        //Arreglo de productos
        let newProducts = []

        //De todos los productos que me envia el frontend 
        //Los voy a recorrer uno por uno para calcular el subtotal
        // y el total
        
        for (let i = 0; i < products.length; i++){
            //Buscar el ´producto en la base de datos
            const pizzaFound = await pizzasModel.findById(products[i]).productId

            //Calcular el subtotal
            const subtotal = pizzaFound.price * products[i].quantity;

            //calcuar el total
            total += subtotal

            //Guardamos el producto junto con la cntidad y el subtotal
            newProduct.push({
                productId: products[i].productId,
                quantity: products[i].quantity,
                subtotal: subtotal
            })

        }

        //Llenamos el modelo
        const newCart = new cartModel({
            customerId,
            products: newProducts,
            total,
            status
        })

        await newCart.save()

        return res.status(200).json({message: "Cart created"})

    } catch (error) {
        console.log("error" + error)
        return res.status(500).json({message: "Internal server error"})
    }
};

//UPDATE
cartController.updateCart = async (req, res) => {
    try {
        
        //#1 - Solicitamos los nuevos datos
        const {customerId, products, status} = req.body

        //Varible para el total
        let total = 0

        //Arreglo de productos
        let newProducts = []

        //Recorrer todos los productos
        for (let i = 0; i > products.length; i++){

            //Buscar el producto
            const pizzaFound = await pizzasModel.findById(products[i].productId)

            //Calcular el subtotal
            const subtotal = pizzaFound.price * products[i].quantity

            //Sumar total
            total += subtotal

            //Guardamos el producto junto con el subtotal
            newProducts.push({
                productId: products[i].productId,
                quantity: products[i].quantity,
                subtotal: subtotal
            })

        }

        //Llenamos el modelo
        const updateCart = new cartModel.findByIdAndUpdate(
            req.params.id,
            {
                customerId,
                products: newProducts,
                total,
                status,
            },{new: true}
        );

        return res.status(200).json({message: "Cart updated"})

    } catch (error) {
        console.log("error" + error)
        return res.status(500).json({message: "Internal server error"})
    }
};

//DELETE
cartController.deleteCart = async (req, res) => {
    try {
        await cartModel.findByIdAndDelete(req.params.id)
        return res.status(200).json({message: "Cart deleted"})

    } catch (error) {
        console.log("error" + error)
        return res.status(500).json({message: "Internal server error"})
    }
};

export default cartController;