import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../entity/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const user_signup = async (req: Request, res: Response, next: NextFunction) => {
    const userRepository = getRepository(User);
    try {
      const existingUser = await userRepository.findOne({ email: req.body.email });
      if (existingUser) {
        return res.status(409).json({ message: "Mail exists" });
      }
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = userRepository.create({
        email: req.body.email,
        password: hashedPassword
      });
      await userRepository.save(newUser);
      res.status(201).json({ message: "User created" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };
  
  export const user_login = async (req: Request, res: Response, next: NextFunction) => {
    const userRepository = getRepository(User);
    try {
      const user = await userRepository.findOne({ email: req.body.email });
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      const passwordMatch = await bcrypt.compare(req.body.password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Authentication failed" });
      }
      if (!process.env.JWT_KEY) {
        return res.status(500).json({ message: "JWT secret key is not defined" });
      }
      const token = jwt.sign({ email: user.email, userId: user.id }, process.env.JWT_KEY, { expiresIn: "1h" });
      res.status(200).json({ message: "Auth successful", token: token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };
  
  export const user_delete = async (req: Request, res: Response, next: NextFunction) => {
    const userRepository = getRepository(User);
    try {
      const result = await userRepository.delete(req.params.userId);
      if (result.affected === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "User deleted" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };