import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import {
  type DefaultSession,
  type NextAuthConfig,
  CredentialsSignin,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { db } from "../db";
import * as schema from "../db/schema";
import { z } from "zod";

const secret = process.env.NEXTAUTH_SECRET ?? "";
const maxAge = 60 * 60 * 24; // 1day

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: number;
      name: string;
      username: string;
      email: string;
      type: "admin" | "user";
    };
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

class InvalidLoginError extends CredentialsSignin {
  code = "E-mail ou senha inválidos";
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  secret,
  callbacks: {
    jwt({ token, user }) {
      // Initial sign in
      if (user?.id) {
        return {
          ...token,
          ...user,
        };
      }

      return token;
    },
    session({ session, token }) {
      if (token?.id && typeof token.id === "string") {
        return {
          ...session,
          user: {
            ...session.user,
            ...token,
          },
        };
      }

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge,
  },
  jwt: {
    maxAge,
  },
  providers: [
    CredentialsProvider({
      name: "Credenciais",
      credentials: {
        email: {
          label: "email",
          type: "email",
        },
        password: {
          label: "password",
          type: "text",
        },
      },
      async authorize(credentials) {
        const input = loginSchema.safeParse(credentials);
        if (input.error) {
          throw new Error("Parâmetros inválidos");
        }

        const [user] = await db
          .select()
          .from(schema.usersTable)
          .where(eq(schema.usersTable.email, input.data.email))
          .limit(1);

        if (!user) {
          throw new InvalidLoginError();
        }

        const samePassword = await bcrypt.compare(
          input.data.password,
          user.password,
        );

        if (!samePassword) {
          throw new InvalidLoginError();
        }

        return {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          type: user.type,
        };
      },
    }),
  ],
} satisfies NextAuthConfig;
