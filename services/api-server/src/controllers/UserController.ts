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
    router.delete("/user/:id", this.deleteUser.bind(this));
    router.put("/user/:id", this.updateUser.bind(this));
    router.post("/user/register", this.userRegister.bind(this));
  }

  // Şifre güçlülük kontrolü
  private validatePassword(password: string): {
    isValid: boolean;
    message?: string;
  } {
    if (password.length < 8) {
      return { isValid: false, message: "Şifre en az 8 karakter olmalıdır" };
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return {
        isValid: false,
        message: "Şifre en az bir küçük harf içermelidir",
      };
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return {
        isValid: false,
        message: "Şifre en az bir büyük harf içermelidir",
      };
    }
    if (!/(?=.*\d)/.test(password)) {
      return { isValid: false, message: "Şifre en az bir rakam içermelidir" };
    }
    return { isValid: true };
  }

  // Avatar oluşturma fonksiyonu
  private generateAvatar(companyName: string): string {
    const initial = companyName.trim().charAt(0).toUpperCase();

    // Basit renk paleti (şirket adına göre sabit renk)
    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#96CEB4",
      "#FECA57",
      "#FF9FF3",
      "#54A0FF",
      "#5F27CD",
      "#00D2D3",
      "#FF9F43",
      "#6C5CE7",
      "#A29BFE",
      "#FD79A8",
      "#E17055",
      "#00B894",
    ];

    // Şirket adının karakter kodlarının toplamına göre renk seç
    const colorIndex =
      companyName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      colors.length;
    const backgroundColor = colors[colorIndex];

    // SVG avatar oluştur
    const svg = `
      <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="${backgroundColor}"/>
        <text x="50" y="50" font-family="Arial, sans-serif" font-size="40" font-weight="bold" 
              fill="white" text-anchor="middle" dominant-baseline="central">
          ${initial}
        </text>
      </svg>
    `;

    const base64Avatar = `data:image/svg+xml;base64,${Buffer.from(
      svg.trim()
    ).toString("base64")}`;

    return base64Avatar;
  }

  public async getUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id || id.length !== 24) {
        res.status(400).json({ message: "Geçersiz kullanıcı ID'si" });
        return;
      }

      const user = await Users.findById(
        id,
        "companyName email phoneNumber avatar smsNotification emailNotification createdAt"
      );

      if (!user) {
        res.status(404).json({ message: RESOURCE_NOT_FOUND_API_ERROR });
        return;
      }

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

      // ID format kontrolü
      if (!id || id.length !== 24) {
        res.status(400).json({ message: "Geçersiz kullanıcı ID'si" });
        return;
      }

      const user = await Users.findByIdAndDelete(id);

      if (!user) {
        res.status(404).json({ message: RESOURCE_NOT_FOUND_API_ERROR });
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

      // ID format kontrolü
      if (!id || id.length !== 24) {
        res.status(400).json({ message: "Geçersiz kullanıcı ID'si" });
        return;
      }

      const user = await Users.findById(id);

      if (!user) {
        res.status(404).json({ message: RESOURCE_NOT_FOUND_API_ERROR });
        return;
      }

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

        const passwordValidation = this.validatePassword(newPassword);
        if (!passwordValidation.isValid) {
          res.status(400).json({ message: passwordValidation.message });
          return;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        updateData.password = hashedPassword;
      }

      const updatedUser = await Users.findByIdAndUpdate(
        id,
        { $set: updateData },
        {
          new: true,
          select:
            "companyName email avatar phoneNumber smsNotification emailNotification createdAt",
        }
      );

      if (!updatedUser) {
        res.status(404).json({ message: RESOURCE_NOT_FOUND_API_ERROR });
        return;
      }

      res.status(200).json({
        message: "Kullanıcı başarı ile güncellendi.",
        user: updatedUser,
      });
    } catch (err) {
      this.logger.error(`Update user error : ${err}`);

      if (err.name === "ValidationError") {
        res.status(400).json({ message: "Geçersiz veri formatı" });
        return;
      }

      if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        res.status(400).json({ message: `Bu ${field} zaten kullanımda` });
        return;
      }

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

      if (!email || !password || !companyId || !companyName) {
        res.status(400).json({
          message: "Email, password, companyId and companyName are required.",
        });
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({ message: "Geçersiz email formatı" });
        return;
      }

      const existingUserByEmail = await Users.findOne({ email });
      if (existingUserByEmail) {
        res.status(400).json({ message: "Bu email adresi zaten kullanımda" });
        return;
      }

      const existingUserByCompanyId = await Users.findOne({ companyId });
      if (existingUserByCompanyId) {
        res.status(400).json({ message: "Bu şirket ID'si zaten kullanımda" });
        return;
      }

      if (phoneNumber) {
        const existingUserByPhone = await Users.findOne({ phoneNumber });
        if (existingUserByPhone) {
          res
            .status(400)
            .json({ message: "Bu telefon numarası zaten kullanımda" });
          return;
        }
      }

      const passwordValidation = this.validatePassword(password);
      if (!passwordValidation.isValid) {
        res.status(400).json({ message: passwordValidation.message });
        return;
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const userAvatar = avatar || this.generateAvatar(companyName);

      const newUser = new Users({
        email,
        phoneNumber,
        password: hashedPassword,
        companyId,
        companyName,
        avatar: userAvatar,
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
          createdAt: newUser.createdAt,
        },
      });
    } catch (err) {
      this.logger.error(`User registration error: ${err}`);

      if (err.name === "ValidationError") {
        res.status(400).json({ message: "Geçersiz veri formatı" });
        return;
      }

      if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        res.status(400).json({ message: `Bu ${field} zaten kullanımda` });
        return;
      }

      res.status(500).json({ message: INTERNAL_SERVER_API_ERROR });
    }
  }
}
