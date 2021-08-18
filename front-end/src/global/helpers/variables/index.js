export const FORM_STATUS = {
  idle: "idle",
  active: "active",
  loading: "loading",
  success: "success",
  error: "error",
};

export const COMBOBOX_STATUS = {
  idle: "idle",
  loading: "loading",
  active: "active",
  noResults: "noResults",
  error: "error",
  success: "success",
  added: "added",
  removed: "removed",
};

export const PROFILES_STATUS = {
  idle: "idle",
  initialLoading: "initialLoading",
  initialWaiting: "initialWaiting",
  initialError: "initialError",
  filtersLoading: "filtersLoading",
  filtersError: "filtersError",
  paginationLoading: "paginationLoading",
  paginationError: "paginationError",
};

export const CARD_STATUS = {
  idle: "idle",
  loading: "loading",
  error: "error",
};

export const SUBSCRIPTION_STATUS = {
  idle: "idle",
  loading: "loading",
  error: "error",
  stripeAwait: "stripeAwait",
  stripeReady: "stripeReady",
};

export const CANCEL_STATUS = {
  cancel: "cancel",
  ok: "ok",
};

export const USER_TYPE = {
  user: "user",
  customer: "customer",
  subscriber: "subscriber",
  inactiveSubscriber: "inactiveSubscriber",
  checkoutError: "checkoutError",
};

export const ERROR_MESSAGE = {
  required: "This field is required.",
  nameShort: `Invalid. 1-65 characters: "whitespace A-Z a-z 0-9 . ( ) ' , -"`,
  nameLong: "Invalid. 1-65 characters: whitespace, upper or lower case letters, 0-9, periods, parentheses, apostrophes, commas, hyphens/dashes.",
  titleShort: `Invalid. 2-80 characters: "whitespace A-Z a-z 0-9 . / + # : ( ) ' " , & -"`,
  titleLong: "Invalid. 2-80 characters: whitespace, upper or lower case letters, 0-9, periods, slashes, plus signs, number/hash signs, colons, parentheses, apostrophes, quotation marks, commas, ampersands, hyphens/dashes.",
  summaryShort: `Invalid. 2-280 characters: "whitespace A-Z a-z 0-9 . / + # : ( ) ' " , & @ ! _ -"`,
  summaryLong: "Invalid. 2-280 characters: whitespace, upper or lower case letters, 0-9, periods, slashes, plus signs, number/hash signs, colons, parentheses, apostrophes, quotation marks, commas, ampersands, at sign, exclamation mark, underscores, hyphens/dashes.",
  githubShort: "Invalid. Input can be a username or valid github URL with username.",
  githubLong: `Invalid. Input can be a username or valid github URL with username (e.g. "username" or "https://github.com/username").`,
  twitterShort: "Invalid. Input can be a username or valid twitter URL with username.",
  twitterLong: `Invalid. Input can be a username or valid twitter URL with username (e.g. "username" or "https://twitter.com/username").`,
  linkedinShort: "Invalid. Input can be a username or valid linkedin URL with username.",
  linkedinLong: `Invalid. Input can be a username or valid linkedin URL with username (e.g. "username" or "https://linkedin.com/in/username").`,
  urlShort: "Invalid. Please enter a valid website URL.",
  urlLong: "Invalid. Please enter a valid website URL (e.g. https://website-name.com).",
  emailShort: "Invalid. Please enter a valid email address.",
  emailLong: "Invalid. Please enter a valid email address (e.g. example@mail.com)."
}
