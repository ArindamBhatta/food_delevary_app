import bcrypt from "bcrypt";
import { VendorPayload } from "../dto";
import jwt from "jsonwebtoken";
import { API_SECRET } from "../config";
import { AuthPayload } from "../dto/auth.dto";
import { Request } from "express";

export const GeneratedSalt = async () => {
  return await bcrypt.genSalt();
};

export const GeneratePassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};

export const ValidatePassword = async (
  enteredPassword: string,
  savePassword: string,
  salt: string
) => {
  return (await GeneratePassword(enteredPassword, salt)) === savePassword;
};

export const GenerateSignature = (payload: VendorPayload) => {
  const signature = jwt.sign(payload, API_SECRET, { expiresIn: "1d" });
  return signature;
};

export const ValidateSignature = async (req: Request) => {
  const signature = req.get("Authorization");
  if (signature) {
    const token = signature.split(" ")[1];
    const payload = (await jwt.verify(token, API_SECRET)) as AuthPayload;
    req.user = payload;
    return true;
  }
  return false;
};
