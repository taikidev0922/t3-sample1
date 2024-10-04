import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

// 制御マスタのスキーマ
const controlSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
});

// 制御マスタ詳細のスキーマ
const controlDetailSchema = z.object({
  id: z.number().optional(),
  controlId: z.number(),
  code: z.string(),
  name: z.string(),
  isDelete: z.boolean().optional(), // 削除フラグ
});

export const controlRouter = createTRPCRouter({
  findAll: publicProcedure.query(async ({ ctx }) => {
    const controls = await ctx.db.control.findMany({
      include: {
        details: true,
      },
      orderBy: { createdAt: "asc" },
    });

    return controls;
  }),

  createControl: publicProcedure
    .input(controlSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const newControl = await ctx.db.control.create({
          data: {
            name: input.name,
          },
        });

        return { success: true, data: newControl };
      } catch (error) {
        console.error("Create control error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "制御マスタの作成中にエラーが発生しました。",
        });
      }
    }),

  bulkUpsertDetails: publicProcedure
    .input(z.array(controlDetailSchema))
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await ctx.db.$transaction(async (prisma) => {
          const upsertedDetails = await Promise.all(
            input.map(async (detail) => {
              if (detail.id) {
                if (detail.isDelete) {
                  // 削除操作
                  return prisma.controlDetail.delete({
                    where: { id: detail.id },
                  });
                } else {
                  // 更新操作
                  return prisma.controlDetail.update({
                    where: { id: detail.id },
                    data: {
                      code: detail.code,
                      name: detail.name,
                    },
                  });
                }
              } else {
                // 新規作成操作
                return prisma.controlDetail.create({
                  data: {
                    controlId: detail.controlId,
                    code: detail.code,
                    name: detail.name,
                  },
                });
              }
            }),
          );

          return upsertedDetails;
        });

        return { success: true, data: result };
      } catch (error) {
        console.error("Bulk upsert control details error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "制御マスタ詳細の一括登録・更新・削除中にエラーが発生しました。",
        });
      }
    }),
});
