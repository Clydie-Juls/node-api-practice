import { Request, Response } from "express";
import { prisma } from "../db";
import { Prisma, Update } from "@prisma/client";
import { matchedData } from "express-validator";

export const getAllUpdates = async (req: Request, res: Response) => {
  const products = await prisma.product.findMany({
    where: {
      belongsToId: req?.user?.id,
    },
    include: {
      updates: true,
    },
  });

  const updates = products.reduce((allUpdates: Array<Object>, product) => {
    return [...allUpdates, ...product.updates];
  }, []);

  res.status(200).json({ data: updates });
};

export const getOneUpdate = async (req: Request, res: Response) => {
  const update = await prisma.update.findUnique({
    where: {
      id: req.params.id,
    },
  });

  res.status(200).json({ data: update });
};

export const createProduct = async (req: Request, res: Response) => {
  const product = await prisma.product.findUnique({
    where: {
      id: req.params.productId,
    },
  });

  if (!product) {
    return res
      .status(400)
      .json({ error: `Product ${req.params.productId} not found` });
  }

  const update = await prisma.update.create({
    data: {
      ...matchedData(req),
      title: req.body.title,
      body: req.body.body,
      product: { connect: { id: req.params.productId } },
    },
  });

  res.status(200).json({ data: update });
};

export const updateUpdate = async (req: Request, res: Response) => {
  const update = await prisma.update.findUnique({
    where: {
      id: req.params.id,
    },
  });

  if (!update) {
    return res.status(400).json({ error: `Update ${req.params.id} not found` });
  }

  const product = await prisma.product.findFirst({
    where: {
      id: update.productId,
      belongsToId: req?.user?.id,
    },
  });

  if (!product) {
    return res.status(400).json({ error: `Update ${req.params.id} not found` });
  }

  const updatedUpdate = await prisma.update.update({
    where: {
      id: req.params.id,
    },
    data: {
      ...matchedData(req),
    },
  });

  res.status(200).json({ data: updatedUpdate });
};

export const deleteUpdate = async (req: Request, res: Response) => {
  const update = await prisma.update.findUnique({
    where: {
      id: req.params.id,
    },
  });

  if (!update) {
    return res.status(400).json({ error: `Update ${req.params.id} not found` });
  }

  const product = await prisma.product.findFirst({
    where: {
      id: update.productId,
      belongsToId: req?.user?.id,
    },
  });

  if (!product) {
    return res.status(400).json({ error: `Update ${req.params.id} not found` });
  }

  const deletedUpdate = await prisma.update.delete({
    where: {
      id: req.params.id,
    },
  });

  res.status(200).json({ data: deletedUpdate });
};
