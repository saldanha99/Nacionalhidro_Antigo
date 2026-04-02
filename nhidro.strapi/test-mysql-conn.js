const mysql = require('mysql');

function main() {
  const conn = mysql.createConnection({
    host: '127.0.0.1',
    port: 33060,
    user: 'nhidro',
    password: 'nhidropassword',
    database: 'nhidro'
  });
  
  conn.connect(err => {
    if (err) {
      console.error('Connection failed:', err.message);
      return;
    }
    console.log('Connected successfully!');
    
    conn.query('SELECT COUNT(*) as count FROM clientes', (err, results) => {
      if (err) {
        console.error('Error querying:', err.message);
      } else {
        console.log(`Clientes na base antiga: ${results[0].count}`);
      }
      conn.end();
    });
  });
}

main();
