import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    age: number;

    @Column()
    gender: string;

    @Column()
    company: string;

    @Column()
    role: string;

    @CreateDateColumn()
    createdAt: Date;
}
