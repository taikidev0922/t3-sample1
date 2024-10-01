import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const customerRouter = createTRPCRouter({
  findAll: publicProcedure
    .input(
      z
        .object({
          name: z.string().optional(),
          code: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const where = {
        ...(input?.name ? { name: { contains: input.name } } : {}),
        ...(input?.code ? { code: { contains: input.code } } : {}),
      };

      const customers = await ctx.db.customer.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });

      return customers ?? [];
    }),
});
