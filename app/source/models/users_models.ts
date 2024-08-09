import { QueryResult } from 'mysql2';
import { connection } from './connection.js';

/**
 * agrega un nuevo usuario en los registro, este usuario tendra el rol de cliente con acceso nivel 1
 * @param {string} fullName
 * @param {string} email 
 * @param {string} username 
 * @param {string} hash 
 * @returns {QueryResult} resultado de la consulta
 */
export const newUSer = async function(fullName:String,email:String,username:String,hash:String):Promise<QueryResult>{
  try{
    const [result] = await connection.query(`insert into users values(null,"${fullName}","${email}","${username}","${hash}",${1})`);
    return result;
  }
  catch(error){
    throw(error);
  }
  finally{
    connection.releaseConnection;
  }
}

/**
 * obtiene datos de un usuario para verificar su informacion
 * @param {string} username 
 * @returns {QueryResult} lista con un objeto que contiene la informacion solicitada
 */
export const dataAutentication = async function(username:String):Promise<QueryResult>{
  try{
    const [rows,field] = await connection.query(`select id_user,role,level_access,user_password from users inner join roles on roles.id_role = user_role where "${username}" = username`);
    return rows;
  }
  catch(error){
    throw error;
  }
  finally{
    connection.releaseConnection;
  }
}

/**
 * obtiene informacion de un usuario
 * @param {number} idUSer 
 * @returns {QueryResult} lista con un objeto que contiene la informacion solicitada
 */
export const userData = async function(idUSer:Number):Promise<QueryResult>{
  try{
    const [result] = await connection.query(`select fullname,email,username from users where id_user = ${idUSer}`);
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
 * obtiene el perfil del usuario
 * @param {number} idUser
 * @returns {QueryResult} lista con un objeto que contiene la informacion solicitada
 */
export const userProfile = async function(idUser:Number):Promise<QueryResult>{
  try{
    const [result] = await connection.query(`select fullname,email,username from users where id_user = ${idUser}`);
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
 * actualiza el campo fullname por un nuevo dato
 * @param {number} idUser 
 * @param {string} newFullname 
 * @returns {QueryResult} resultado de la consulta
 */
export const setFullName = async function(idUser:number,newFullname:String):Promise<QueryResult>{
  try{
    const [result] = await connection.query(`update users set fullname = "${newFullname}" where id_user = ${idUser}`);
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
 * actualiza el campo email por un nuevo valor
 * @param {number} idUser 
 * @param {string} email 
 * @returns {QueryResult} resultado de la consulta
 */
export const setEmail = async function(idUser:number,email:String):Promise<QueryResult>{
  try{
    const [result] = await connection.query(`update users set email = "${email}" where id_user = ${idUser}`);
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
 * actualiza el campo username por un nuevo valor
 * @param {number} idUser 
 * @param {string} newUsername 
 * @returns {QueryResult} resultado de la consulta
 */
export const setUsername = async function(idUser:number,newUsername:String):Promise<QueryResult>{
  try{
    const [result] = await connection.query(`update users set username = "${newUsername}" where id_user = ${idUser}`);
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
 * actualiza el campo user_password por un nuevo valor
 * @param {number} idUser 
 * @param {string} newHash 
 * @returns {QueryResult}
 */
export const setPassword = async function(idUser:number,newHash:String):Promise<QueryResult>{
  try{
    const [result] = await connection.query(`update users set user_password = "${newHash}" where id_user = ${idUser}`);
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
 * obtiene la contraseña de un usuario
 * @param {number} idUser 
 * @returns {QueryResult} lista con un objeto que contiene el dato solicitado
 */
export const getPassword = async function(idUser:number):Promise<QueryResult>{
  try{
    const [result] = await connection.query(`select user_password from users where id_user = ${idUser};`);
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
 * esta consulta elemina los registros de un usario en la base de datos
 * @param {number} idUSer 
 * @returns {QueryResult}
 */
export const deleteUserData = async function(idUSer:number):Promise<QueryResult>{
  try{
    const [result] = await connection.query(`delete from users where id_user = ${idUSer}`);
    return result;
  }
  catch(error){
    throw error;
  }
  finally{
    connection.releaseConnection;
  }
}