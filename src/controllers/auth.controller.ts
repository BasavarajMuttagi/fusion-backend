import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { UserLoginType, UserSignUpType } from "../zod/schema";
import prisma from "../../prisma/db";
import { APP_BASE_URL, client, SECRET_SALT } from "../..";
import { TokenPayload } from "google-auth-library";

const SignUpUser = async (req: Request, res: Response) => {
  try {
    const { firstname, lastname, email, password, authProvider } =
      req.body as UserSignUpType;
    const isUserExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (isUserExists) {
      res.status(409).send({ message: "Account Exists!" });
      return;
    }
    const encryprtedPassword = await bcrypt.hash(password!, 10);
    await prisma.user.create({
      data: {
        firstname,
        lastname,
        email,
        authProvider,
        password: encryprtedPassword,
      },
    });
    return res.status(201).send({ message: "Account Created SuccessFully!" });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Error Occured , Please Try Again!", error });
  }
};

const LoginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as UserLoginType;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      res.status(409).send({ message: "User Not Found!" });
      return;
    }
    const fullname = `${user.firstname} ${user.lastname}`;
    const isPasswordMatch = await bcrypt.compare(
      password,
      user.password as string,
    );
    if (!isPasswordMatch) {
      res.status(400).send({ message: "email or password incorrect" });
      return;
    }
    const token = sign(
      {
        userId: user.id,
        email: user.email,
        name: fullname,
      },
      SECRET_SALT,
      { expiresIn: "1h" },
    );
    res.status(200).send({
      user: {
        fullname,
        email: user.email,
      },
      token: token,
      message: "success",
    });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Error Occured , Please Try Again!", error });
  }
};

const GoogleAuth = async (req: Request, res: Response) => {
  try {
    const authUrl = client.generateAuthUrl({
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ],
    });

    return res.json({ authUrl });
  } catch (error) {
    res.status(500).send({ message: "Error Occurred, Please Try Again!" });
    console.log(error);
  }
};

const GoogleAuthCallback = async (req: Request, res: Response) => {
  try {
    const { code } = req.query;
    const { tokens } = await client.getToken(code as string);
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const {
      email,
      given_name: firstname,
      family_name: lastname,
      sub: googleId,
    } = ticket.getPayload() as TokenPayload;
    let user = await prisma.user.findUnique({ where: { email } });

    //if user doesn't exists
    if (!user) {
      user = await prisma.user.create({
        data: {
          googleId,
          authProvider: "google",
          email: email!,
          firstname: firstname!,
          lastname: lastname!,
        },
      });
    }

    //if user exits but provider is local, update to google
    if (user && user.authProvider === "local")
      await prisma.user.update({
        where: { email },
        data: {
          googleId,
          authProvider: "google",
        },
      });

    const token = sign(
      {
        userId: user.id,
        email: user.email,
        name: `${user.firstname} ${user.lastname}`,
      },
      SECRET_SALT,
      { expiresIn: "1h" },
    );

    return res.redirect(`${APP_BASE_URL}/redirect?token=${token}&success=true`);
  } catch (error) {
    console.error("Error during Google authentication:", error);
    return res.redirect(
      `${APP_BASE_URL}/redirect?success=false&error=${"Error during Google authentication:"}`,
    );
  }
};
export { SignUpUser, LoginUser, GoogleAuthCallback, GoogleAuth };
