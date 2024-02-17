const { z } = require("zod");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const JWT = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT is required!.");

const userTokenSchema = z.object({
  _id: z.string(),
  role: z.string(),
});

function validateUserSignup(data) {
  const schema = z.object({
    firstname: z.string(),
    lastname: z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });

  return schema.safeParse(data);
}

function validateUserSignin(data) {
  const schama = z.object({
    email: z.string().email(),
    password: z.string().min(3),
  });

  return schama.safeParse(data);
}

function generatehash(password, salt = uuidv4()) {
  const hash = crypto.createHmac("sha256", salt).update(password).digest("hex");
  return { hash, salt };
}

function generateUserToken(data) {
  const gUserToken = userTokenSchema.safeParse(data);
  if (gUserToken.error) throw new Error(gUserToken.error);

  const token = JWT.sign(JSON.stringify(gUserToken.data), JWT_SECRET);
  return token;
}

function validateUserToken(token) {
  try {
    const checkToken = JWT.verify(token, JWT_SECRET);
    const safeParseResult = userTokenSchema.safeParse(checkToken);
    if (safeParseResult.error) throw new Error(safeParseResult.error);
    return safeParseResult.data;
  } catch (error) {
    return null;
  }
}

module.exports = {
  validateUserSignup,
  validateUserSignin,
  generateUserToken,
  generatehash,
  validateUserToken,
};
