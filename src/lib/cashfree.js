const { Cashfree } = require("cashfree-pg");

const APP_ID = process.env.CASHFREE_APP_ID;
const SECRET_KEY = process.env.CASHFREE_SECRET_KEY;
const ENV = process.env.CASHFREE_ENV === "PRODUCTION" ? "PROD" : "TEST";

const cashfree = new Cashfree(ENV, APP_ID, SECRET_KEY);

export default cashfree;
