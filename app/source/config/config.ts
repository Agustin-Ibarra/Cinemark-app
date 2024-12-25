import dotenv from 'dotenv';
import envalid from 'envalid';

dotenv.config();

export const config = envalid.cleanEnv(
  process.env,
  {
    PORT:envalid.port({default:3001}),
    EXPIRES:envalid.str(),
    SECRET:envalid.str(),
    STRIPE:envalid.str(),
    DB_USERNAME:envalid.str(),
    DB_PASSWORD:envalid.str(),
    DB_HOST:envalid.host(),
    DB_PORT:envalid.num(),
    DB_NAME:envalid.str(),
    SUCCESS_URL:envalid.url(),
    CANCEL_URL:envalid.url(),
    DELIVERY:envalid.str(),
    RECEIVER:envalid.str(),
    CODES:envalid.str()
  }
)