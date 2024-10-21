import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Ticket } from "./tickets.models.js";

@Table({
  tableName:'formats',
  timestamps:false
})
export class Format extends Model{
  @PrimaryKey
  @AutoIncrement
  @Column({
    type:DataType.INTEGER
  })
  id_format!: number

  @Column({
    type:DataType.STRING
  })
  type_format!:string

  @Column({
    type:DataType.INTEGER
  })
  enabled!:number

  @HasMany(()=> Movie)
  movies!: Movie[]
}

@Table({
  tableName:'clasifications',
  timestamps:false
})
export class Clasification extends Model{
  @PrimaryKey
  @AutoIncrement
  @Column({
    type:DataType.INTEGER
  })
  id_clasification!: number

  @Column({
    type:DataType.STRING
  })
  type!:string

  @Column({
    type:DataType.INTEGER
  })
  enabled!:number

  @HasMany(()=> Movie)
  movies!:Movie[]
}

@Table({
  tableName:'suppliers',
  timestamps:false
})
export class Supplier extends Model{
  @PrimaryKey
  @AutoIncrement
  @Column({
    type:DataType.INTEGER
  })
  id_supplier!:number

  @Column({
    type:DataType.STRING
  })
  supplier!:string

  @Column({
    type:DataType.STRING
  })
  active!:number

  @HasMany(()=>Movie)
  movies!:Movie[]
}

@Table({
  tableName:'movies',
  timestamps:false
})
export class Movie extends Model{
  @PrimaryKey
  @AutoIncrement
  @Column({
    type:DataType.INTEGER
  })
  id_movie!:number

  @Column({
    type:DataType.STRING
  })
  title!:string

  @Column({
    type:DataType.STRING
  })
  description!:string

  @ForeignKey(()=> Clasification)
  @Column({
    type:DataType.INTEGER
  })
  clasification!:number

  @Column({
    type:DataType.DATE
  })
  duration_time!:string

  @Column({
    type:DataType.STRING
  })
  poster!:string

  @ForeignKey(()=> Supplier)
  @Column({
    type:DataType.INTEGER
  })
  supplier!:number

  @ForeignKey(()=> Format)
  @Column({
    type:DataType.INTEGER
  })
  format!:number

  @Column({
    type:DataType.INTEGER
  })
  premier!:number

  @Column({
    type:DataType.STRING
  })
  trailer!:string

  @BelongsTo(()=> Format)
  formats!:Format
  @BelongsTo(()=>Supplier)
  suppliers!:Supplier
  @BelongsTo(()=>Clasification)
  clasifications!:Clasification
  @HasMany(()=>Ticket)
  ticket!:Ticket[]
}