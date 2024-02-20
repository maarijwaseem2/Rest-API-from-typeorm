import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './Product'; 

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    _id: number;

    @ManyToOne(() => Product, { eager: true }) 
    @JoinColumn({ name: 'product_id' }) 
    product: Product;

    @Column({ type: 'int', default: 1 })
    quantity: number;
}
