const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(email);
};

const isStrongPassword = (password) => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#^_-]).{7,}$/;
  return passwordRegex.test(password);
};

const isValidTaskTitle = (title) => {
  if (!title || title.trim().length < 3) return false;

  const cleanTitle = title.trim();

  // must contain at least one proper word with 3+ letters
  const wordRegex = /[A-Za-z]{3,}/;

  // reject mostly symbols/numbers/junk
  const meaningfulChars = cleanTitle.replace(/[^A-Za-z]/g, "");

  return wordRegex.test(cleanTitle) && meaningfulChars.length >= 3;
};

module.exports = {
  isValidEmail,
  isStrongPassword,
  isValidTaskTitle,
};