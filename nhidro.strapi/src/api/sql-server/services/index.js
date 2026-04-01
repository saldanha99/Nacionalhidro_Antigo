const dbConfig = require("./db.config");

const sql = require("mssql");

const get = async (query) => {

  try {

      const pool = await sql.connect(dbConfig);
      
      const result  = await pool
          .request()
          .query(query)

      return {
        error: false,
        data: result.recordset
    }
  }
  catch (error) {
      return {
          error: true,
          message: error
      }
  }
}

const create = async (query) => {

  try {
      
      const pool = await sql.connect(dbConfig);
         
      await pool.request().query(query);

      return {
          error: false,
          message: 'Success Create'
      }
  }
  catch (error) {

      return {
          error: true,
          message: error
      }
  }
}

const update = async (query) => {

  try {
      
      const pool = await sql.connect(dbConfig);
         
      await pool.request().query(query);

      return {
          error: false,
          message: 'Success Update'
      }
  }
  catch (error) {

      return {
          error: true,
          message: error
      }
  }
}

const find = async (query) => {

    try {
  
        const pool = await sql.connect(dbConfig);
        
        const result  = await pool
            .request()
            .query(query)
  
        return {
          error: false,
          data: result.recordset
      }
    }
    catch (error) {
        return {
            error: true,
            message: error
        }
    }
  }
module.exports = {
  get,
  create,
  update,
  find
};
