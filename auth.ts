import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"
import authConfig from "@/auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
  events: {
    // Khi user mới được tạo
    async createUser({ user }) {
      await prisma.user.update({
        where: { id: Number(user.id) },
        data: {
          role: {
            connect: { id: 1 }, // id của role USER trong DB
          },
        },
      })
    },
  },
})
