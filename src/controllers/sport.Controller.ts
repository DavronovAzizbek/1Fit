import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class SportController {
  static async getAllSports(req: Request, res: Response): Promise<void> {
    try {
      const sports = await prisma.sports.findMany({
        include: { gymsSport: { select: { gyms: true } } },
      });
      res.json(sports);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async getSportById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      const sport = await prisma.sports.findUnique({
        where: { id: parseInt(id) },
        include: { gymsSport: { select: { gyms: true } } },
      });

      if (!sport) {
        res.status(404).json({ error: "Sport Not Found ❌" });
        return;
      }

      res.json(sport);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async createSport(req: Request, res: Response): Promise<void> {
    const { name } = req.body;

    try {
      const sport = await prisma.sports.create({
        data: { name },
      });
      res.json(sport);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async updateSport(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { name } = req.body;

    try {
      const sport = await prisma.sports.update({
        where: { id: parseInt(id) },
        data: { name },
      });
      res.json(sport);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async deleteSport(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      await prisma.sports.delete({
        where: { id: parseInt(id) },
      });
      res.json({ message: "Sport Deleted Successfully ✅" });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async searchSport(req: Request, res: Response): Promise<Response> {
    const { searchTerm } = req.body;
    try {
      const sport = await prisma.sports.findMany({
        where: {
          name: {
            contains: searchTerm as string,
            mode: "insensitive",
          },
        },
      });
      return res.json(sport);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  }
}

export default SportController;
