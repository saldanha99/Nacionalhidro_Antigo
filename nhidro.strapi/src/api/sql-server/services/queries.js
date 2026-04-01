
const path = require('path');
const fs = require('fs');

const listQueries =  () => {

    const fullPath  = `${path.resolve("./")}/public/query/queries.json`; 
    const rawdata =  fs.readFileSync(fullPath);
    const queries = JSON.parse(rawdata);
    
    return queries;
}

const formatQueryValues = (query, listKeyValue) => {
    for(const keyValye of listKeyValue){

        query = query.replace(keyValye.key, keyValye.value);
    }
    return query;
}

module.exports = {
    listQueries,
    formatQueryValues,
}
