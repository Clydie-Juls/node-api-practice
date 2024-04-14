import { Request, Response } from "express";
import { prisma } from "../db";

export const getAllProducts = async (req: Request, res: Response) => {
  const products = await prisma.product.findMany({
    where: {
      belongsToId: req?.user?.id,
    },
  });

  res.status(200).json({ data: products });
};

export const getOneProduct = async (req: Request, res: Response) => {
  const product = await prisma.product.findFirst({
    where: {
      id: req.params.id,
      belongsToId: req?.user?.id,
    },
  });

  res.status(200).json({ data: product });
};

export const createProduct = async (req: Request, res: Response) => {
  const product = await prisma.product.create({
    data: {
      name: req.body.name,
      belongsToId: req?.user?.id,
    },
  });

  res.status(200).json({ data: product });
};

export const updateProduct = async (req: Request, res: Response) => {
  const updatedProduct = await prisma.product.update({
    where: {
      id: req.params.id,
      belongsToId: req?.user?.id,
    },
    data: {
      name: req.body.name,
    },
  });

  res.status(200).json({ data: updatedProduct });
};

export const deleteProduct = async (req: Request, res: Response) => {
  const deletedProduct = await prisma.product.delete({
    where: {
      id: req.params.id,
      belongsToId: req?.user?.id,
    },
  });

  res.status(200).json({ data: deletedProduct });
};
