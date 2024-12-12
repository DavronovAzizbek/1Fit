import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class GymController {
  static async getAllGyms(req: Request, res: Response): Promise<Response> {
    try {
      const gyms = await prisma.gyms.findMany({
        include: { gymsSport: { select: { sports: true } } },
      });
      return res.json(gyms);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  }

  static async getGymById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    try {
      const gym = await prisma.gyms.findUnique({
        where: { id: parseInt(id) },
        include: { gymsSport: { select: { sports: true } } },
      });
      if (!gym) {
        return res.status(404).json({ error: "Gym Not Found ❌" });
      }
      return res.json(gym);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  }

  static async createGym(req: Request, res: Response): Promise<Response> {
    const { name, address } = req.body;
    try {
      const gym = await prisma.gyms.create({
        data: { name, address },
      });
      return res.json(gym);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  }

  static async updateGym(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { name, address } = req.body;
    try {
      const gym = await prisma.gyms.update({
        where: { id: parseInt(id) },
        data: { name, address },
      });
      return res.json(gym);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  }

  static async deleteGym(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    try {
      await prisma.gyms.delete({
        where: { id: parseInt(id) },
      });
      return res.json({ message: "Gym Deleted Successfully ✅" });
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  }

  static async searchGyms(req: Request, res: Response): Promise<Response> {
    const { searchTerm } = req.body;
    try {
      const gyms = await prisma.gyms.findMany({
        where: {
          name: {
            contains: searchTerm as string,
            mode: "insensitive",
          },
        },
      });
      return res.json(gyms);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  }

  static async addSportToGym(req: Request, res: Response): Promise<Response> {
    const { gymsId, sportsId } = req.body;

    try {
      const gymExists = await prisma.gyms.findUnique({
        where: { id: gymsId },
      });

      if (!gymExists) {
        return res.status(404).json({ error: "Gym Not Found ❌" });
      }

      const sportExists = await prisma.sports.findUnique({
        where: { id: sportsId },
      });

      if (!sportExists) {
        return res.status(404).json({ error: "Sport Not Found ❌" });
      }

      const gymsSport = await prisma.gymsSport.create({
        data: { gymsId, sportsId },
      });
      return res.json(gymsSport);
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  }
}

export default GymController;
