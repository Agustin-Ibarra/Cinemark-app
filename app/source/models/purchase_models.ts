import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "./users_models.js";
import { Ticket } from "./tickets_models.js";

@Table({
  tableName:'purchase_order',
  timestamps:false
})
export class PurchaseOrder extends Model{
  @PrimaryKey
  @Column({
    type:DataType.STRING
  })
  id_purchase!:string

  @Column({
    type:DataType.DATE,
    defaultValue:DataType.NOW
  })
  date_purchase!:Date

  @Column({
    type:DataType.STRING
  })
  seller!:string

  @ForeignKey(()=>User)
  @Column({
    type:DataType.INTEGER
  })
  customer!:number

  @Column({
    type:DataType.FLOAT
  })
  total!:number

  @BelongsTo(()=>User)
  users!:User[]
}

@Table({
  tableName:'purchase_details',
  timestamps:false
})
export class PurchaseDetails extends Model{
  @PrimaryKey
  @AutoIncrement
  @Column({
    type:DataType.INTEGER
  })
  id_purchase_details!:number

  @ForeignKey(()=> PurchaseOrder)
  @Column({
    type:DataType.STRING
  })
  id_purchase_order!:string

  @ForeignKey(()=>Ticket)
  @Column({
    type:DataType.INTEGER
  })
  ticket_movie!:number

  @Column({
    type:DataType.INTEGER
  })
  amount_ticket!:number

  @ForeignKey(()=>Ticket)
  @Column({
    type:DataType.INTEGER
  })
  unit_price!:number

  @Column({
    type:DataType.FLOAT
  })
  sub_total!:number

  @BelongsTo(()=>Ticket)
  tickets!:Ticket[]
  @BelongsTo(()=>PurchaseOrder)
  purchasesOrders!:PurchaseOrder[]
}
