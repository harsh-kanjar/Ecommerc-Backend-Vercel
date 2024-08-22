const express = require('express')
const router = express.Router();
const Products = require('../../models/Products');
const Orders = require('../../models/Orders');
const Category = require('../../models/Category');
const fetchuser = require('../../middleware/fetchuser');
const Cart = require('../../models/Cart')

// Route 1: Get all the products using: GET /api/v1/product/getallproducts       --User Api -- no login required
router.get('/getallproducts', async (req, res) => {
    try {
        const productList = await Products.find();
        res.json(productList);
    } catch (error) {
        console.error('Error fetching products:', error.message);
        res.status(500).json({ error: 'Internal server error' }); // Sending JSON error response
    }
});

// Route 2:
router.get('/getproduct/:id', async (req, res) => {
    try {
        const product = await Products.findById(req.params.id);
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.json(product);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal server error');
    }
});



// Route 3: Add a new product using: POST api/v1/product/addproduct              --Admin Api --login required 
router.post('/addproduct', fetchuser, async (req, res) => {
    try {
        console.log("Received request body:", req.body);

        const { productName, description, richDescription, featuredImage, subImage1, subImage2, subImage3, brand, price, category, countOfStock, rating, isFeatured, keywords } = req.body;

        const product = new Products({
            productName, description, richDescription, featuredImage, subImage1, subImage2, subImage3, brand, price, category, countOfStock, rating, isFeatured, keywords, user: req.user.id
        });

        const savedProduct = await product.save();
        res.json(savedProduct);
    } catch (error) {
        console.error("Error in /addproduct route:", error.message);
        res.status(500).send('Internal server error');
    }
});

// Route 4: Remove an item from the cart: DELETE  /api/v1/product/deleteproduct/:id       --Admin Api --login required
router.delete('/deleteproduct/:id', fetchuser, async (req, res) => {
    try {
        // Find the cart item to be removed
        let productItem = await Products.findById(req.params.id);
        if (!productItem) {
            return res.status(404).send('Item not found');
        }

        // Delete the product item
        await Products.findByIdAndDelete(req.params.id);
        res.json({ success: "Item has been removed from the Product List", productItem: productItem });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});


// Route 5
router.put('/updatecartitem/:cartItemId', fetchuser, async (req, res) => {
    const { cartItemId } = req.params;
    const { size } = req.body;

    try {
        // Find the cart item by ID and update the size
        const cartItem = await Cart.findByIdAndUpdate(
            cartItemId,
            { size },
            { new: true }
        );

        if (!cartItem) {
            return res.status(404).json({ error: "Cart item not found" });
        }

        res.json(cartItem);
    } catch (error) {
        console.error("Error updating cart item size:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});







// Route 6: Make a new order using: POST api/v1/product/makeorder           --User Api --login required
 
// DECREPTED ROUTE
// Route to place an order
router.post('/makeorder', fetchuser, async (req, res) => {
    try {
        const { fullName, phone, address, line2, city, state, zip, country, paymentMode, couponCode } = req.body;

        // Fetch cart items for the logged-in user
        const cartItems = await Cart.find({ user: req.user.id }).populate('product');

        if (cartItems.length === 0) {
            return res.status(400).json({ message: "Your cart is empty" });
        }

        // Calculate total price
        let totalPrice = 0;
        const orderItems = cartItems.map(item => {
            const itemTotalPrice = item.product.price * item.quantity;
            totalPrice += itemTotalPrice;
            return {
                product: item.product._id,
                quantity: item.quantity,
                size:item.size,
                price: item.product.price
            };
        });

        // Create a new order instance
        const order = new Orders({
            user: req.user.id,
            orderItems,
            fullName,
            address,
            line2,
            city,
            state,
            zip,
            country,
            phone,
            totalPrice,
            couponCode,
            paymentMode  // Make sure to save paymentMode
        });

        // Save the order to the database
        const savedOrder = await order.save();

        // Clear the cart after placing the order
        await Cart.deleteMany({ user: req.user.id });

        res.json(savedOrder);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
});

 



// Route 7: Get all the orders using: GET /api/v1/product/getallorders       --User Api --login required
router.get('/getallorders', fetchuser, async (req, res) => {
    try {
        const orderList = await Orders.find({ user: req.user.id });
        res.send(orderList);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal server error');
    }
});


// Route 8: Remove an item from the cart: DELETE  /api/v1/product/cancelorder/:id       --Admin Api --login required
router.delete('/cancelorder/:id', fetchuser, async (req, res) => {
    try {
        // Find the cart item to be removed
        let orderItem = await Orders.findById(req.params.id);
        if (!orderItem) {
            return res.status(404).send('Item not found');
        }

        // Allow removal only if the user owns it
        if (orderItem.user.toString() !== req.user.id) {
            return res.status(401).send('Not allowed');
        }

        // Delete the cart item
        await Orders.findByIdAndDelete(req.params.id);
        res.json({ success: "Item has been removed from the Order List", orderItem: orderItem });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});


// Route 9: Add a category using: POST api/v1/product/addcategory           --Admin Api --login required
router.post('/addcategory',fetchuser, async (req, res) => {
    try {
        // Destructuring all required and optional fields
        const { name , color , icon , image } = req.body;

        // Creating a new order instance
        const category = new Category({name , color , icon , image,user: req.user.id });

        // Save the order to the database
        const savedOrder = await category.save();
        res.json(savedOrder);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal server error');
    }
});

// Route 10: Get all the orders using: GET /api/v1/product/getallcategory       --User Api
router.get('/getallcategory', async (req, res) => {
    try {
        const categoryList = await Category.find()
        res.send(categoryList)

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal server error');
    }
})


// Route 11: Remove an item from the cart: DELETE  /api/v1/product/deleteproduct/:id       --Admin Api --login required
router.delete('/deletecategory/:id', fetchuser, async (req, res) => {
    try {
        // Find the cart item to be removed
        let categoryItem = await Category.findById(req.params.id);
        if (!categoryItem) {
            return res.status(404).send('Item not found');
        }

        // Delete the product item
        await Category.findByIdAndDelete(req.params.id);
        res.json({ success: "Item has been removed from the Category List", categoryItem: categoryItem });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});


// Route 12: Add an item to the cart: POST /api/cart/addtocart
router.post('/addtocart', fetchuser, async (req, res) => {
    try {
        const { productId, quantity,size } = req.body;

        // Check if the product is already in the cart
        let cartItem = await Cart.findOne({ user: req.user.id, product: productId });

        if (cartItem) {
            // If the product is already in the cart, update the quantity
            cartItem.quantity += quantity;
        } else {
            // If the product is not in the cart, create a new cart item
            cartItem = new Cart({
                user: req.user.id,
                product: productId,
                quantity: quantity,
                size:size
            });
        }

        // Save the cart item to the database
        await cartItem.save();
        res.json({ success: "Item has been added to the cart", cartItem: cartItem });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// Route 13: Remove an item from the cart: DELETE /api/cart/remove/:id
// Route: Remove an item from the cart
router.delete('/removefromcart/:id', fetchuser, async (req, res) => {
    try {
        // Find the cart item to be removed
        let cartItem = await Cart.findById(req.params.id);
        if (!cartItem) {
            return res.status(404).send('Item not found');
        }

        // Allow removal only if the user owns it
        if (cartItem.user.toString() !== req.user.id) {
            return res.status(401).send('Not allowed');
        }

        // Delete the cart item
        await Cart.findByIdAndDelete(req.params.id);
        res.json({ success: "Item has been removed from the cart", cartItem: cartItem });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

 
// Route 15: Fetch all items in the cart: GET /api/cart/getcartproducts
router.get('/getcartproducts', fetchuser, async (req, res) => {
    try {
        // Find all cart items for the logged-in user
        const cartItems = await Cart.find({ user: req.user.id }).populate('product');

        if (cartItems.length === 0) {
            return res.status(404).json({ message: "Your cart is empty" });
        }

        res.json({ success: "Cart items retrieved successfully", cartItems: cartItems });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;