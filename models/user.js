const knex = require("../db/knex");

const TABLE_NAME = "users";

async function findById(userId){
  const user = await where({id: userId});
  if(user === null){
    throw new Error("User Not Found!")
  }
  // スプレッド構文
  return {...user};
}

async function where(condition){
  return await knex(TABLE_NAME)
  .where(condition)
  .then((results) =>{
    if(results.length === 0){
      return null;
    }
    console.log(results[0]);
    return results[0];
  });
}

module.exports = {
  findById,
};