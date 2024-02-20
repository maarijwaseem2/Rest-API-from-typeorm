// src/controllers/productController.ts
import { getRepository } from 'typeorm';
import { Request, Response, NextFunction } from 'express';
import { Product } from '../entity/Product';

export const products_get_all = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productRepository = getRepository(Product);
    const products = await productRepository.find();
    res.status(200).json({ count: products.length, products });
  } catch (err) {
    console.error('Error fetching products: ', err);
    res.status(500).json({ error: err.message });
  }
};

export const products_create_product = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'No file uploaded'
      });
    }
    
    const productRepository = getRepository(Product);
    const { name, price } = req.body;
    const product = new Product();
    product.name = name;
    product.price = price;
    product.productImage = req.file.path;

    await productRepository.save(product);

    res.status(201).json({
      message: 'Created product successfully',
      createdProduct: {
        name: product.name,
        price: product.price,
        _id: product.id,
        request: {
          type: 'GET',
          url: `http://localhost:3000/products/${product.id}`
        }
      }
    });
  } catch (err) {
    console.error('Error creating product: ', err);
    res.status(500).json({ error: err.message });
  }
};

export const products_get_product = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.productId as string;
    const productRepository = getRepository(Product);
    const product = await productRepository.findOne(id);

    if (product) {
      res.status(200).json({
        product,
        request: {
          type: 'GET',
          url: 'http://localhost:3000/products'
        }
      });
    } else {
      res.status(404).json({ message: 'No valid entry found for provided ID' });
    }
  } catch (err) {
    console.error('Error fetching product: ', err);
    res.status(500).json({ error: err.message });
  }
};

export const products_update_product = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.productId;
    const productRepository = getRepository(Product);
    const product = await productRepository.findOne(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const { name, price } = req.body;
    product.name = name;
    product.price = price;

    await productRepository.save(product);

    res.status(200).json({
      message: 'Product updated',
      request: {
        type: 'GET',
        url: `http://localhost:3000/products/${id}`
      }
    });
  } catch (err) {
    console.error('Error updating product: ', err);
    res.status(500).json({ error: err.message });
  }
};

export const products_delete = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.productId;
    const productRepository = getRepository(Product);
    const product = await productRepository.findOne(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await productRepository.remove(product);

    res.status(200).json({
      message: 'Product deleted',
      request: {
        type: 'POST',
        url: 'http://localhost:3000/products',
        body: { name: 'String', price: 'Number' }
      }
    });
  } catch (err) {
    console.error('Error deleting product: ', err);
    res.status(500).json({ error: err.message });
  }
};
