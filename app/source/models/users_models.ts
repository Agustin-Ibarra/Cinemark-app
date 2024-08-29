import { AutoIncrement, Column, DataType, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { PurchaseOrder } from "./purchase_models.js";

@Table({
  tableName:'roles',
  timestamps:false
})
export class Role extends Model{
  @PrimaryKey
  @AutoIncrement
  @Column({
    type:DataType.INTEGER
  })
  id_role!:number

  @Column({
    type:DataType.STRING
  })
  role!:string

  @Column({
    type:DataType.INTEGER
  })
  level_access!:number

  @HasMany(()=>User)
  users!:User[]

}

@Table({
  tableName:'users',
  timestamps:false
})
export class User extends Model{
  @PrimaryKey
  @AutoIncrement
  @Column({
    type:DataType.INTEGER
  })
  id_user!:number

  @Column({
    type:DataType.STRING
  })
  fullname!:string

  @Column({
    type:DataType.STRING
  })
  email!:string

  @Column({
    type:DataType.STRING
  })
  username!:string

  @Column({
    type:DataType.STRING
  })
  user_password!:string

  @ForeignKey(()=>Role)
  @Column({
    type:DataType.INTEGER
  })
  user_role!:number

  @HasMany(()=>PurchaseOrder)
  purchaseOrders!:PurchaseOrder[]
}