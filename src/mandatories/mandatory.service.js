/* 
Definition
*/
const Mandatory = {
  register: ["givenName", "familyName", "password", "email"],
  login: ["password", "email"],
  post: ["headline", "body"],
  comment: ["content", "post"],
  like: ["post"],
};
//

/* 
Export
*/
module.exports = Mandatory;
//
