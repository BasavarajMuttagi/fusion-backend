import { z } from "zod";

const AuthProviderEnum = z.enum(["local", "google"]);

const UserSignUpSchema = z
  .object({
    firstname: z.string().min(1),
    lastname: z.string().min(1),
    email: z.string().email(),
    password: z
      .string()
      .min(8, { message: "password cannot be less than 8 digits" })
      .max(10, { message: "password cannot be more than 10 digits" })
      .optional(),
    confirmpassword: z
      .string()
      .min(8, { message: "password cannot be less than 8 digits" })
      .max(10, { message: "password cannot be more than 10 digits" })
      .optional(),
    authProvider: AuthProviderEnum.default("local"),
  })
  .refine((data) => !(data.authProvider === "local" && !data.password), {
    message: "Password is required for local auth provider",
    path: ["password"],
  });

type UserSignUpType = z.infer<typeof UserSignUpSchema>;

const UserLoginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "password cannot be less than 8 digits" })
    .max(10, { message: "password cannot be more than 10 digits" }),
});

type UserLoginType = z.infer<typeof UserLoginSchema>;
export type { UserSignUpType, UserLoginType };
export { UserSignUpSchema, UserLoginSchema };
