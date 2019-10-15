module.exports.showform = (req, res) => {
  res.status(201).render("form.pug");
};
module.exports.login = (req, res) => {
  res.status(201).render("login.pug");
};
module.exports.profile = (req, res) => {
  res.status(201).render("profile.pug");
};
module.exports.forgotPassword = (req, res) => {
  res.status(201).render("forgotPass.pug");
};
module.exports.resetPassword = (req, res) => {
  res.status(201).render("forgetPasswordConfirm.pug");
};

