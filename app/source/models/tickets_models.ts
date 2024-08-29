import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Format, Movie } from "./movies_models.js";

@Table({
  tableName:'halls',
  timestamps:false
})
export class Hall extends Model{
  @PrimaryKey
  @AutoIncrement
  @Column({
    type:DataType.INTEGER
  })
  id_hall!:number

  @Column({
    type:DataType.STRING
  })
  hall_name!:string

  @Column({
    type:DataType.NUMBER
  })
  capacity!:number

  @Column({
    type:DataType.INTEGER
  })
  enabled!:number

  @HasMany(()=>Ticket)
  tickets!:Ticket[]
}


@Table({
  tableName:'tickets',
  timestamps:false
})
export class Ticket extends Model{
  @PrimaryKey
  @AutoIncrement
  @Column({
    type:DataType.INTEGER
  })
  id_ticket!:number

  @Column({
    type:DataType.DATE
  })
  date_ticket!:string

  @ForeignKey(()=> Movie)
  @Column({
    type:DataType.INTEGER
  })
  movie!:number

  @ForeignKey(()=>Hall)
  @Column({
    type:DataType.INTEGER
  })
  hall!:number

  @ForeignKey(()=>Format)
  @Column({
    type:DataType.INTEGER
  })
  ticket_format!:number

  @Column({
    type:DataType.FLOAT
  })
  ticket_price!:number

  @Column({
    type:DataType.INTEGER
  })
  stock!:number
  
  @Column({
    type:DataType.NUMBER
  })
  subtitles!:number

  @BelongsTo(()=>Movie)
  movies!:Movie[]
  @BelongsTo(()=>Format)
  formats!:Format[]
  @BelongsTo(()=>Hall)
  halls!:Hall[]
}