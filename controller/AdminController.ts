import { Request, Response, NextFunction } from "express";
import { CreateVendorInput } from "../dto";
import { Vendor, VenderDoc } from "../models";
import { GeneratedSalt, GeneratePassword } from "../utility";

//step 1: - check if the vendor is already exist

//step 2:  then create the vendor

// Without VenderDoc interface - no type safety
export const FindVendor = async (
  id?: string,
  email?: string
): Promise<VenderDoc | null> => {
  if (email) {
    return await Vendor.findOne({ email: email });
  } else {
    return await Vendor.findById(id);
  }
};

// controller function. It receives the HTTP request from the UI (frontend), extracts the vendor data from the request body, and processes it.
export const CreateVendor = async (req: Request, res: Response) => {
  const {
    name,
    address,
    pincode,
    foodType,
    email,
    password,
    ownerName,
    phone,
  } = <CreateVendorInput>req.body;

  const existingVendor = await FindVendor(undefined, email);

  if (existingVendor !== null) {
    return res
      .status(404)
      .json({ message: "A vendor is exist with this email ID" });
  }

  //generate a salt
  const salt = await GeneratedSalt();

  const userPassword = await GeneratePassword(password, salt);

  const CreateVendorInDB = await Vendor.create({
    name: name,
    address: address,
    pincode: pincode,
    foodType: foodType,
    email: email,
    password: userPassword,
    salt: salt,
    ownerName: ownerName,
    phone: phone,
    rating: 0,
    serviceAvailable: false,
    coverImages: [],
  });

  //encrypt password using the salt

  //create a response message for user
  res.status(201).json({
    success: true,
    message: "Vendor created successfully!",
    data: {
      id: CreateVendorInDB._id,
      name: CreateVendorInDB.name,
      email: CreateVendorInDB.email,
      ownerName: CreateVendorInDB.ownerName,
      phone: CreateVendorInDB.phone,
      address: CreateVendorInDB.address,
      pincode: CreateVendorInDB.pincode,
      foodType: CreateVendorInDB.foodType,
      rating: CreateVendorInDB.rating,
      serviceAvailable: CreateVendorInDB.serviceAvailable,
    },
  });
};

export const getVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendor = await Vendor.find();

  if (vendor !== null) {
    return res.json(vendor);
  }

  res.json({ message: "vendors data not available" });
};

export const getVendorById = async (req: Request, res: Response) => {
  const vendorId: string = req.params.id;

  const vender = await Vendor.findById(vendorId);

  if (vender !== null) {
    return res.json(vender);
  }

  res.json({ message: "Vendor Data is not available" });
};
