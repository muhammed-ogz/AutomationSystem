# 🚀 React + TypeScript + NodeJS Otomasyon Sistemi

Bu proje, modern web teknolojilerini kullanarak kullanıcı dostu, mobil uyumlu bir otomasyon sistemi geliştirmek için hazırlanmıştır. Proje React ve TypeScript ile frontend, Node.js ile backend altyapısını içerir ve Docker ile konteynerleştirilmiştir.

---

## 📋 İçindekiler

1. [Özellikler](#özellikler)
2. [Kurulum](#kurulum)
3. [Kullanım](#kullanım)
4. [Proje Yapısı](#proje-yapısı)
5. [API Endpoints](#api-endpoints)
6. [Teknolojiler](#teknolojiler)
7. [Katkıda Bulunma](#katkıda-bulunma)

---

## 🎯 Özellikler

- **Mobil uyumlu:** Fully responsive tasarım.
- **Modüler yapı:** React ve TypeScript ile ölçeklenebilir frontend.
- **API:** RESTful API ile Node.js backend.
- **Veritabanı:** MongoDB kullanımı.
- **Docker:** Tüm sistemi kapsayan container yapısı.
- **Authentication:** JWT tabanlı oturum yönetimi.
- **Kolay kurulum:** Docker Compose ile tek komutla çalıştırılabilir.

---

## ⚙️ Kurulum

### Gereksinimler
- [Node.js](https://nodejs.org/) (v22 veya üzeri)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### Adımlar

1. Projeyi klonlayın:
   ```bash
   git clone https://github.com/muhammed-ogz/AutomationSystem.git
   cd AutomationSystem
   ```

2. Çevresel değişkenleri ayarlayın:
   `.env.example` dosyasını kopyalayarak `.env` oluşturun ve gerekli değerleri düzenleyin:
   ```bash
   cp .env.example .env
   ```

3. Docker container'larını başlatın:
   ```bash
   docker-compose up -d
   ```

4. Uygulamayı tarayıcıda açın:
   ```
   npm run dev
   ```

---

## 🚀 Kullanım

### Frontend
React uygulaması `http://localhost:5173` üzerinde çalışır.

### Backend
Node.js API `http://localhost:3000` üzerinde çalışır.

---

## 📂 Proje Yapısı

```plaintext
AutomationSystem/
├── api-server/             # Node.js backend
│   ├── src/
│   │   ├── controllers/ # API controller dosyaları
│   │   ├── models/      # Veritabanı modelleri
│   │   ├── routes/      # API endpoint rotaları
│   │   ├── app.ts       # Uygulama başlangıcı
│   └── Dockerfile       # Backend için Docker tanımı
├── client  /            # React frontend
│   ├── src/
│   │   ├── components/  # React bileşenleri
│   │   ├── pages/       # Sayfa bazlı dosyalar
│   │   ├── App.tsx      # Ana uygulama dosyası
│   └── Dockerfile       # Frontend için Docker tanımı
├── docker-compose.yml   # Docker Compose yapılandırması
└── README.md            # Proje dökümantasyonu
```

---

## 🔗 API Endpoints (güncellenecektir...)

### Kullanıcı Yönetimi
- **POST** `/api/auth/register` - Kullanıcı kaydı.
- **POST** `/api/auth/login` - Kullanıcı girişi.
- **GET** `/api/users` - Tüm kullanıcıları listele.

### Örnek API Cevabı
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "oguz",
    "email": "oguz@example.com"
  }
}
```

---

## 🛠️ Teknolojiler

- **Frontend:** React, TypeScript, TailwindCSS
- **Backend:** Node.js, Express.js
- **Veritabanı:** MongoDB
- **Container:** Docker, Docker Compose
- **Authentication:** JSON Web Tokens (JWT)

---

## 🤝 Katkıda Bulunma

1. Bu repoyu forklayın.
2. Yeni bir branch oluşturun:
   ```bash
   git checkout -b feature/yeni-ozellik
   ```
3. Yaptığınız değişiklikleri commitleyin:
   ```bash
   git commit -m "Yeni özellik eklendi."
   ```
4. Branch’i pushlayın:
   ```bash
   git push origin feature/yeni-ozellik
   ```
5. Pull request açın!

---

## 📝 Lisans

Bu proje [MIT Lisansı](LICENSE) ile lisanslanmıştır.

---

Herhangi bir sorunuz olursa, bana ulaşmaktan çekinmeyin! 😊