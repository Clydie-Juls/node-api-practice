import { Request, Response } from "express";
import { prisma } from "../db";
import { UpdatePoint } from "@prisma/client";
import { matchedData } from "express-validator";

export const getAllUpdatePoints = async (req: Request, res: Response) => {
  const products = await prisma.product.findMany({
    where: {
      belongsToId: req?.user?.id,
    },
    include: {
      updates: {
        include: {
          updatePoints: true,
        },
      },
    },
  });

  const updates = products.reduce(
    (allUpdatesPoints: Array<UpdatePoint>, product) => {
      const updatePoints = product.updates.reduce(
        (productUpdatePoints: Array<UpdatePoint>, update) => {
          return [...productUpdatePoints, ...update.updatePoints];
        },
        []
      );
      return [...allUpdatesPoints, ...updatePoints];
    },
    []
  );

  res.status(200).json({ data: updates });
};

export const getOneUpdatePoint = async (req: Request, res: Response) => {
  const updatePoint = await prisma.updatePoint.findUnique({
    where: {
      id: req.params.id,
    },
    include: {
      update: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!updatePoint?.update?.product) {
    return res
      .status(400)
      .json({ error: `Update point ${req.params.id} not found` });
  }

  if (updatePoint.update.product.belongsToId !== req?.user?.id) {
    return res.status(400).json({ error: `Update ${req.params.id} not found` });
  }

  res.status(200).json({ data: { ...updatePoint, update: undefined } });
};

export const createProductPoint = async (req: Request, res: Response) => {
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

  const updatePoint = await prisma.updatePoint.create({
    data: {
      name: req.body.name,
      description: req.body.description,
      update: { connect: { id: req.params.id } },
    },
  });

  res.status(200).json({ data: updatePoint });
};

export const updateUpdatePoint = async (req: Request, res: Response) => {
  const updatePoint = await prisma.updatePoint.findUnique({
    where: {
      id: req.params.id,
    },
  });

  if (!updatePoint) {
    return res
      .status(400)
      .json({ error: `UpdatePoint ${req.params.id} not found` });
  }

  const update = await prisma.update.findUnique({
    where: {
      id: updatePoint.updateId,
    },
  });

  if (!update) {
    return res
      .status(400)
      .json({ error: `UpdatePoint ${req.params.id} not found` });
  }

  const product = await prisma.product.findFirst({
    where: {
      id: update.productId,
      belongsToId: req?.user?.id,
    },
  });

  if (!product) {
    return res
      .status(400)
      .json({ error: `UpdatePoint ${req.params.id} not found` });
  }

  const updateUpdatePoint = await prisma.updatePoint.update({
    where: {
      id: req.params.id,
    },
    data: {
      ...matchedData(req),
    },
  });

  res.status(200).json({ data: updateUpdatePoint });
};

export const deleteProductPoint = async (req: Request, res: Response) => {
  const updatePoint = await prisma.updatePoint.findUnique({
    where: {
      id: req.params.id,
    },
  });

  if (!updatePoint) {
    return res
      .status(400)
      .json({ error: `UpdatePoint ${req.params.id} not found` });
  }

  const update = await prisma.update.findUnique({
    where: {
      id: updatePoint.updateId,
    },
  });

  if (!update) {
    return res
      .status(400)
      .json({ error: `UpdatePoint ${req.params.id} not found` });
  }

  const product = await prisma.product.findFirst({
    where: {
      id: update.productId,
      belongsToId: req?.user?.id,
    },
  });

  if (!product) {
    return res
      .status(400)
      .json({ error: `UpdatePoint ${req.params.id} not found` });
  }

  const deleteProductPoint = await prisma.updatePoint.delete({
    where: {
      id: req.params.id,
    },
  });

  res.status(200).json({ data: deleteProductPoint });
};
