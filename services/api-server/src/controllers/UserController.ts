import bcrypt from "bcryptjs";
import { Request, Response, Router } from "express";
import { Logger } from "pino";
import {
  INTERNAL_SERVER_API_ERROR,
  RESOURCE_NOT_FOUND_API_ERROR,
} from "../api";
import Users from "../database/mongodb/models/Users";

export class UserController {
  public constructor(private readonly logger: Logger) {}
  public registerRoutes(router: Router) {
    router.get("/user/:id", this.getUser.bind(this));
  }

  public async getUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await Users.findById(id, "companyName email");

      // kullanıcı yoksa
      if (!user) {
        res.status(404).json({ message: RESOURCE_NOT_FOUND_API_ERROR });
        return;
      }
      // kullanıcı varsa
      res.status(200).json({
        message: "User found",
        user,
      });
    } catch (err) {
      this.logger.error(`Get user error : ${err}`);
      res.status(500).json({ message: INTERNAL_SERVER_API_ERROR });
    }
  }

  public async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await Users.findByIdAndDelete(id);

      if (!user) {
        res.ststus(404).json({ message: RESOURCE_NOT_FOUND_API_ERROR });
        return;
      }
      res.status(200).json({
        message: "User deleted successfully",
        user: {
          id: user._id,
          email: user.email,
          companyName: user.companyName,
        },
      });
    } catch (err) {
      this.logger.error(`Delete user error : ${err}`);
      res.status(500).json({ message: INTERNAL_SERVER_API_ERROR });
    }
  }

  public async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { oldPassword, newPassword, ...updateData } = req.body;
      const user = await Users.findById(id);

      if (!user) {
        res.status(404).json({ message: RESOURCE_NOT_FOUND_API_ERROR });
        return;
      }

      //eğer yeni şifre varsa eski şifreyi kontrol et
      if (newPassword) {
        if (!oldPassword) {
          res.status(400).json({
            message: "Şifreyi güncellemek için eski şifreyi girmeniz gerekli",
          });
          return;
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
          res.status(401).json({ message: "Eski şifre yanlış" });
          return;
        }

        //yeni şifreyi hashler ve updateData içerisine ekler
        const hashedpassword = await bcrypt.hash(newPassword, 10);
        updateData.password = hashedpassword;
      }

      const updateUser = await Users.findByIdAndUpdate(
        id,
        { $set: updateData },
        {
          new: true,
          fields:
            "companyName email avatar phoneNumber smsNotification emailNotification",
        }
      );

      if (!updateUser) {
        res.status(404).json({ message: RESOURCE_NOT_FOUND_API_ERROR });
        return;
      }
      res.status(200).json({
        message: "Kullanıcı başarı ile güncellendi.",
        user: updateUser,
      });
    } catch (err) {
      this.logger.error(`Update user error : ${err}`);
      res.status(500).json({ message: INTERNAL_SERVER_API_ERROR });
    }
  }
  public async userRegister(req: Request, res: Response) {
    try {
      const {
        email,
        phoneNumber,
        password,
        companyId,
        companyName,
        avatar,
        smsNotification,
        emailNotification,
      } = req.body;
      if (!email || !password || !companyId || !companyName || !avatar) {
        res
          .status(400)
          .json({
            message:
              "Email, password, companyId, companyName and avatar are required.",
          });
        return;
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const newUser = new Users({
        email,
        phoneNumber,
        password: hashedPassword,
        companyId,
        companyName,
        avatar,
        smsNotification: smsNotification || false,
        emailNotification: emailNotification || false,
      });
      await newUser.save();
      res.status(201).json({
        message: "User registered successfully",
        user: {
          id: newUser._id,
          email: newUser.email,
          companyName: newUser.companyName,
          avatar: newUser.avatar,
          phoneNumber: newUser.phoneNumber,
          smsNotification: newUser.smsNotification,
          emailNotification: newUser.emailNotification,
        },
      });
    } catch (err) {
      this.logger.error(`User registration error: ${err}`);
      res.status(500).json(INTERNAL_SERVER_API_ERROR).end();
    }
  }
}
