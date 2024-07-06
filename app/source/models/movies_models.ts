import { QueryResult } from 'mysql2';
import { connection } from './connection.js'

/**
 * selecciona el id,poster,titulo de las peliculas de la categoria premier
 * @returns {QueryResult} lista de peliulas
 */
export const premiers = async function():Promise<QueryResult>{
  try{
    const [result] = await connection.query(`
      select id_movie,title,poster from movies where premier = ${1};
    `);
    return result;
  }
  catch(error){
    throw error;
  }
  finally{
    connection.releaseConnection;
  }
}

/**
 * selecciona el id,titulo,poster de las peliculas que sean de un formato 3D
 * @returns {QueryResult} lista de peliculas
 */
export const movies3D = async function():Promise<QueryResult>{
  try{
    const [result] = await connection.query(`select id_movie,title,poster from movies where format = ${5} or format = ${2} or format = ${4};`);
    return result
  }
  catch(error){
    throw error
  }
  finally{
    connection.releaseConnection;
  }
}

/**
 * selecciona el id,titulo,poster de las peliculas que sean de un formato 2D
 * @returns {QueryResult} lista de peliculas
 */
export const movies2D = async function():Promise<QueryResult>{
  try{
    const [result] = await connection.query(`
      select id_movie,title,poster from movies where format = ${1} or format = ${4};
    `);
    return result;
  }
  catch(error){
    throw error;
  }
  finally{
    connection.releaseConnection;
  }
}

/**
 * obtiene toda la infomacion de una pelicula seleccionada a travez de su id
 * @param {number} idMovie 
 * @returns {QueryResult} retorna una lista con un objeto con la informacion de la plicula
 */
export const movieInfo = async function(idMovie:Number): Promise<QueryResult>{
  try{
    const [result] = await connection.query(`
      select id_movie,title,description,duration_time,poster,trailer,type from movies inner join clasifications on clasifications.id_clasification = clasification where id_movie = ${idMovie};
    `);
    return result
  }
  catch(error){
    throw error;
  }
  finally{
    connection.releaseConnection;
  }
}

/**
 * obtitne informacion de los tickets de una pelicula seleccionada
 * @param {number} idMovie 
 * @returns {QueryResult} lista de objetos con infomacion de los ticktes
 */
export const ticketData = async function(idMovie:Number):Promise<QueryResult>{
  try{
    const [result] = await connection.query(
      `select id_ticket,type_format,date_ticket,subtitles,stock,ticket_price,title,hall_name from tickets inner join formats on formats.id_format = ticket_format inner join movies on movies.id_movie = movie inner join halls on halls.id_hall = hall where movie = ${idMovie} && stock > ${0};`
    );
    return result;
  }
  catch(error){
    throw error;
  }
  finally{
    connection.releaseConnection;
  }
}

/**
 * obtitne informacion de los ticktes de una pelicula del formato 3D
 * @param {number} idMovie 
 * @returns {QueryResult} lista de objetos con infomracion de los ticktes
 */
export const ticketData3D = async function (idMovie:Number):Promise<QueryResult>{
  try{
    const [result] = await connection.query(
      `select type_format,id_ticket,date_ticket,subtitles,hall_name,title,stock,ticket_price from tickets  inner join formats on formats.id_format = ticket_format inner join halls on halls.id_hall = hall inner join movies on movies.id_movie = movie where movie = ${idMovie} and ticket_format = ${2} && stock > ${0}  && date_ticket > current_timestamp();`
    );
    return result;
  }
  catch(error){
    throw error;
  }
  finally{
    connection.releaseConnection;
  }
}

/**
 * obtitne informacion de los ticktes de una pelicula del formato 2D
 * @param {number} idMovie 
 * @returns {QueryResult} lista de objetos con infomracion de los ticktes
 */
export const ticketData2D = async function (idMovie:Number):Promise<QueryResult>{
  try{
    const [result] = await connection.query(
      `select type_format,id_ticket,date_ticket,subtitles,stock,ticket_price,title,hall_name from tickets inner join formats on formats.id_format = ticket_format inner join halls on halls.id_hall = hall inner join movies on movies.id_movie = movie where movie = ${idMovie} and ticket_format = ${1} && stock > ${0};`
    );
    return result;
  }
  catch(error){
    throw error;
  }
  finally{
    connection.releaseConnection;
  }
}

/**
 * actualiza el stock de un ticket al ser reservado para una compra
 * @param {number} idTicket id del ticket
 * @param {number} amount cantidad de tickets seleccionados
 * @returns {QueryResult} informacion del resultdo de la consulta
 */
export const updateStock = async function(idTicket:Number,amount:Number):Promise<QueryResult>{
  try{
    const [result] = await connection.query(`
      update tickets set stock = stock - ${amount} where id_ticket = ${idTicket} && stock >= ${amount} 
    `);
    return result;
  }
  catch(error){
    throw error;
  }
  finally{
    connection.releaseConnection;
  }
}

/**
 * restablece el stock de tickets al cancelar una compra
 * @param {number} idTicket id del ticket 
 * @param {number} amount cantidad del ticket seleccionado
 * @returns {QueryResult}
 */
export const restoreStock = async function(idTicket:Number,amount:Number):Promise<QueryResult>{
  try{
    const [result] = await connection.query(
      `update tickets set stock = stock + ${amount} where id_ticket = ${idTicket};`
    );
    return result;
  }
  catch(error){
    throw error;
  }
  finally{
    connection.releaseConnection;
  }
}

/**
 * agrega el registro de una orden de compra
 * @param {number} idUser id del usuario/cliente
 * @param {number} idPurchase id de la orden de compra
 * @param {number} total total de la compra realizada
 * @returns {QueryResult} informcion de la consulta
 */
export const purchaseOrder = async function(idUser:Number,idPurchase:String,total:Number):Promise<QueryResult>{
  try{
    const [result] = await connection.query(`
      insert into purchase_order values("${idPurchase}",current_timestamp(),"cinemark",${idUser},${total.toFixed(2)});
    `);
    return result;
  }
  catch(error){
    throw error;
  }
  finally{
    connection.releaseConnection;
  }
}

/**
 * agrega el registro del detalle de la orden de compra
 * @param {number} idPurchaseOrder 
 * @param {number} idTicket id del ticket comprado
 * @param {number} amount cantidad del ticket
 * @param {number} unitPrice precio unitario del ticket
 * @param {number} subtotal subtotal de la compra
 * @returns {QueryResult} informacion de la consulta
 */
export const purchaseDetails = async function(idPurchaseOrder:String,idTicket:number,amount:number,unitPrice:number,subtotal:number):Promise<QueryResult>{
  try{
    const [result] = await connection.query(
      `insert into purchase_details values(null,"${idPurchaseOrder}",${idTicket},${amount},${unitPrice},${subtotal.toFixed(2)});`
    )
    return result;
  }
  catch(error){
    throw error;
  }
  finally{
    connection.releaseConnection;
  }
}

/**
 * obtiene informacion de la orden de compra realizada
 * @param {string} idPurchase id de la orden de compra
 * @returns {QueryResult} resultado de la consulta
 */
export const dataPurchase = async function(idPurchase:string):Promise<QueryResult>{
  try{
    const [result] = await connection.query(`
      SELECT date_purchase,title,date_ticket,type_format,subtitles,ticket_price,sub_total,total,fullname,id_purchase_order,poster,amount_ticket from purchase_details INNER JOIN tickets on tickets.id_ticket = ticket_movie INNER JOIN movies on movies.id_movie = movie INNER JOIN purchase_order on purchase_order.id_purchase = id_purchase_order INNER JOIN formats on formats.id_format = ticket_format INNER JOIN users on users.id_user = customer where id_purchase_order = "${idPurchase}";  
    `);
    return result;
  }
  catch(error){
    throw error;
  }
  finally{
    connection.releaseConnection;
  }
}

/**
 * obtiene informacion de los registros de compra de un usuario
 * @param {number} idUser id del usuario
 * @returns {QueryResult} lista de objetos con informacion de las ordenes de compra
 */
export const userPurchase = async function(idUser:number):Promise<QueryResult>{
  try{
    const [result] = await connection.query(`
      SELECT date_purchase,title,poster,subtitles,type_format,total,amount_ticket FROM purchase_details INNER JOIN tickets on tickets.id_ticket = ticket_movie INNER JOIN movies on movies.id_movie = movie INNER JOIN formats on formats.id_format = ticket_format INNER JOIN purchase_order on purchase_order.id_purchase = id_purchase_order WHERE customer = ${idUser};  
    `);
    return result;
  }
  catch(error){
    throw error;
  }
  finally{
    connection.releaseConnection;
  }
}