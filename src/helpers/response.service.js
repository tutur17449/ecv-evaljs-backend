/*
Service definition
*/
const sendApiSuccessResponse = (req, res, data, message) => {
  const apiResponse = {
    endpoint: req.originalUrl,
    method: req.method,
    message: message,
    err: null,
    data: data,
    status: 200,
  };

  return res.status(200).json(apiResponse);
};

const sendApiErrorResponse = (req, res, err, message) => {
  const apiResponse = {
    endpoint: req.originalUrl,
    method: req.method,
    message: message,
    err: err,
    data: null,
    status: 500,
  };

  return res.status(500).json(apiResponse);
};

const renderSuccessVue = (vue, req, res, data, message, redirect) => {
  const apiResponse = {
    endpoint: req.originalUrl,
    method: req.method,
    message: message,
    err: null,
    data: data,
    status: 200,
  };

  // Check for redirection
  return redirect
    ? res.status(200).redirect(vue)
    : res.status(200).render(vue, { data: apiResponse });
};

const renderErrorVue = (vue, req, res, err, message) => {
  const apiResponse = {
    endpoint: req.originalUrl,
    method: req.method,
    message: message,
    err: err,
    data: null,
    status: 500,
  };

  return res.status(500).render(vue, { data: apiResponse });
};
//

/*
Export service fonctions
*/
module.exports = {
  sendApiSuccessResponse,
  sendApiErrorResponse,
  renderSuccessVue,
  renderErrorVue,
};
//
