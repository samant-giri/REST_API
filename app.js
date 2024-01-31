const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

mongoose.connect("mongodb://127.0.0.1:27017/ProductDetails").then(() => {
    console.log("Connected to MongoDB successfully...")
}).catch((err) => {
    console.log(err)
})

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());


const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price:Number
})

const Product = new mongoose.model("Product", productSchema);

app.post("/api/v1/product/new", async (req, res) => {
    const product = await Product.create(req.body);


    if (!product) {
        return res.status(500).json({
            success: false,
            message: "Product Not found!"
        })
    }

    res.status(200).json({
        success: true,
        product
    })
})

app.get("/api/v1/product", async (req, res) => {
    const product = await Product.find();

    if (!product) {
        return res.status(500).json({
            success: false,
            message: "Product Not found!"
        })
    }

    res.status(201).json({
        success: true,
        product
    })
})

app.put("/api/v1/product/:id", async (req, res) => {
    // let product = await Product.findById(req.params.id);

    product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, useFindAndModify: false, runValidators: true });

    if (!product) {
        return res.status(500).json({
            success: false,
            message: "Product Not found!"
        })
    }

    res.status(200).json({
        success: true,
        product
    })
})

app.delete("/api/v1/product/:id", async (req, res) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(500).json({
            success: false,
            message:"Product Not found!"
        })
        
    }

    await product.deleteOne(req.params);

    res.status(200).json({
        success: true,
        message:"Product is deleted successfully"
    })
})

app.listen(4500, () => {
    console.log("server is running on http://localhost:4500")
})