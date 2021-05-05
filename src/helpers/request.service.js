/*
Service definition
*/
const checkFields = (required, bodyData) => {
  /* 
        Variables
        */
  const miss = [];
  const extra = [];
  //

  /*
        Check fields
        */
  // Check missing fields
  required.forEach((prop) => {
    if (!(prop in bodyData)) miss.push(prop);
  });

  // Check extra fields
  for (const prop in bodyData) {
    if (required.indexOf(prop) === -1) extra.push(prop);
  }

  // Set service state
  const ok = extra.length === 0 && miss.length === 0;

  // Return service state
  return { ok, extra, miss };
  //
};
//

/*
Export service fonctions
*/
module.exports = {
  checkFields,
};
//
