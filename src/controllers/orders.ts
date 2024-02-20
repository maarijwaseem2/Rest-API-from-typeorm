import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import { Order } from '../entity/Order';
import { Product } from '../entity/Product';

export const orders_get_all = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderRepository = getRepository(Order);
    const orders = await orderRepository.find({ relations: ['product'] });
    
    res.status(200).json({
      count: orders.length,
      orders: orders.map(order => ({
        _id: order.id,
        product: order.product,
        quantity: order.quantity,
        request: {
          type: 'GET',
          url: `http://localhost:3000/orders/${order.id}`
        }
      }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const orders_create_order = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId, quantity } = req.body;
    const productRepository = getRepository(Product);
    const product = await productRepository.findOne(productId);
    
    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    const orderRepository = getRepository(Order);
    const order = orderRepository.create({
      product: product,
      quantity: quantity
    });
    const result = await orderRepository.save(order);

    res.status(201).json({
      message: "Order stored",
      createdOrder: {
        _id: result.id,
        product: result.product,
        quantity: result.quantity
      },
      request: {
        type: "GET",
        url: `http://localhost:3000/orders/${result.id}`
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message
    });
  }
};

export const orders_get_order = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderId = parseInt(req.params.orderId);
    const orderRepository = getRepository(Order);
    const order = await orderRepository.findOne(orderId, { relations: ['product'] });

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    res.status(200).json({
      order: order,
      request: {
        type: "GET",
        url: `http://localhost:3000/orders`
      }
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

export const orders_delete_order = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderId = parseInt(req.params.orderId);
    const orderRepository = getRepository(Order);
    const result = await orderRepository.delete(orderId);

    if (result.affected === 0) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    res.status(200).json({
      message: "Order deleted",
      request: {
        type: "POST",
        url: "http://localhost:3000/orders",
        body: { productId: "ID", quantity: "Number" }
      }
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};
