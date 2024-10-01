import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

// 得意先の単一レコードのスキーマ
const customerSchema = z.object({
  id: z.string().optional(), // idは文字列またはundefined
  code: z.string(),
  name: z.string(),
  address: z.string().nullable().optional(), // nullableとoptionalを追加
  phoneNumber: z.string().nullable().optional(),
  emailAddress: z.string().email().nullable().optional(),
});

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

      return customers || [];
    }),

  bulkUpsert: publicProcedure
    .input(z.array(customerSchema))
    .mutation(async ({ ctx, input }) => {
      try {
        // トランザクションを開始
        const result = await ctx.db.$transaction(async (prisma) => {
          const upsertedCustomers = await Promise.all(
            input.map(async (customer) => {
              if (customer.id) {
                // 更新操作
                return prisma.customer.update({
                  where: { id: Number(customer.id) },
                  data: {
                    code: customer.code,
                    name: customer.name,
                    address: customer.address,
                    phoneNumber: customer.phoneNumber,
                    emailAddress: customer.emailAddress,
                  },
                });
              } else {
                // 新規作成操作
                return prisma.customer.create({
                  data: {
                    code: customer.code,
                    name: customer.name,
                    address: customer.address,
                    phoneNumber: customer.phoneNumber,
                    emailAddress: customer.emailAddress,
                  },
                });
              }
            }),
          );

          return upsertedCustomers;
        });

        return { success: true, data: result };
      } catch (error) {
        console.error("Bulk upsert error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "得意先の一括登録・更新中にエラーが発生しました。",
        });
      }
    }),
});
