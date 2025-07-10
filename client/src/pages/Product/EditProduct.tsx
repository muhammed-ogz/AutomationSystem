import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AiOutlineUpload } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

// Product türü tanımlaması
interface Product {
  _id: string;
  ProductName: string;
  ProductPrice: number;
  ProductQuantity: number;
  ProductImage?: string;
  CompanyId: string;
  createdAt?: string;
  updatedAt?: string;
}

// API Response türü
interface ApiResponse {
  success: boolean;
  message: string;
  data?: Product;
  error?: string;
}

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Form state'leri
  const [productName, setProductName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [stock, setStock] = useState<string>("");
  const [image, setImage] = useState<string | ArrayBuffer | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>("");

  // Loading ve error state'leri
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Ürün verilerini çekme
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const fetchProduct = async () => {
      if (!id) {
        setError("Ürün ID'si bulunamadı");
        setIsLoading(false);
        return;
      }

      try {
        if (!token) {
          setError("Yetkilendirme token'ı bulunamadı");
          setIsLoading(false);
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_SERVER}/products/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data: ApiResponse = await response.json();

        if (data.success && data.data) {
          const product = data.data;
          setProductName(product.ProductName);
          setPrice(product.ProductPrice.toString());
          setStock(product.ProductQuantity.toString());
          setCurrentImageUrl(
            product.ProductImage && product.ProductImage !== "null"
              ? product.ProductImage
              : ""
          );
        } else {
          setError(data.message || "Ürün bilgileri alınamadı");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Sunucu hatası oluştu");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Resim seçme
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Form güncelleme
  const handleUpdate = async () => {
    if (!id) return;

    // Validasyon
    if (!productName.trim()) {
      alert("Ürün adı boş olamaz!");
      return;
    }

    if (!price || Number(price) < 0) {
      alert("Geçerli bir fiyat giriniz!");
      return;
    }

    if (!stock || Number(stock) < 0) {
      alert("Geçerli bir stok miktarı giriniz!");
      return;
    }

    setIsUpdating(true);
    setError("");

    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        setError("Yetkilendirme token'ı bulunamadı");
        setIsUpdating(false);
        return;
      }

      const updateData = {
        ProductName: productName.trim(),
        ProductPrice: Number(price),
        ProductQuantity: Number(stock),
        ProductImage: typeof image === "string" ? image : currentImageUrl,
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_SERVER}/products/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      const data: ApiResponse = await response.json();

      if (data.success) {
        toast.success(
          "Ürün başarıyla güncellendi! Listeleme sayfasına yönlendiriliyorsunuz..."
        );
        setTimeout(() => {
          navigate("/dashboard/products");
        }, 2000);
      } else {
        setError(data.message || "Güncelleme sırasında hata oluştu");
      }
    } catch (err) {
      console.error("Update error:", err);
      setError("Sunucu hatası oluştu");
    } finally {
      setIsUpdating(false);
    }
  };

  // Loading durumu
  if (isLoading) {
    return (
      <section id="edit-product" className="m-10">
        <motion.div
          className="bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <motion.div
              className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.p
              className="text-xl text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Yükleniyor, lütfen bekleyin...
            </motion.p>
          </div>
        </motion.div>
      </section>
    );
  }

  // Error durumu
  if (error) {
    return (
      <section id="edit-product" className="m-10">
        <motion.div
          className="bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-semibold text-white mb-2">
              Hata Oluştu
            </h2>
            <p className="text-gray-300 mb-4">{error}</p>
            <button
              onClick={() => navigate("/products")}
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all"
            >
              Geri Dön
            </button>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section id="edit-product" className="m-10">
      <motion.div
        className="bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="text-3xl font-semibold text-white mb-6"
          initial={{ y: 0 }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          🛠️ Ürünü Düzenle
        </motion.h1>

        {/* Form Fields */}
        <motion.div
          className="space-y-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {/* Ürün Adı */}
          <motion.div
            variants={{
              hidden: { x: -20, opacity: 0 },
              visible: { x: 0, opacity: 1 },
            }}
          >
            <label
              htmlFor="product-name"
              className="block font-medium text-gray-300"
            >
              Ürün Adı
            </label>
            <input
              type="text"
              id="product-name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Örneğin : Akıllı Telefon"
              className="mt-1 block w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:animate-pulse transition-all"
              disabled={isUpdating}
            />
          </motion.div>

          {/* Ürün Fiyatı ve Stok */}
          <motion.div
            className="flex gap-4"
            variants={{
              hidden: { x: -20, opacity: 0 },
              visible: { x: 0, opacity: 1 },
            }}
          >
            <div className="flex-grow">
              <label
                htmlFor="product-price"
                className="block font-medium text-gray-300"
              >
                Ürün Fiyatı
              </label>
              <input
                type="number"
                id="product-price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="₺0"
                min="0"
                step="0.01"
                className="mt-1 block w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:animate-pulse transition-all"
                disabled={isUpdating}
              />
            </div>
            <div className="flex-grow">
              <label
                htmlFor="product-stock"
                className="block font-medium text-gray-300"
              >
                Stok Miktarı
              </label>
              <input
                type="number"
                id="product-stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="0"
                min="0"
                className="mt-1 block w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:animate-pulse transition-all"
                disabled={isUpdating}
              />
            </div>
          </motion.div>

          {/* Resim Yükleme */}
          <motion.div
            variants={{
              hidden: { x: -20, opacity: 0 },
              visible: { x: 0, opacity: 1 },
            }}
          >
            <label
              htmlFor="product-image"
              className="block font-medium text-gray-300"
            >
              Ürün Resmi
            </label>
            <div className="mt-1 flex items-center gap-4">
              <label
                htmlFor="product-image"
                className={`flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-md cursor-pointer hover:bg-gray-600 transition ${
                  isUpdating ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <AiOutlineUpload className="text-xl text-indigo-400" />
                <span className="text-sm text-gray-200">Resim Seç</span>
              </label>
              <input
                type="file"
                id="product-image"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                disabled={isUpdating}
              />
              {/* Yeni seçilen resim */}
              {typeof image === "string" && (
                <img
                  src={image}
                  alt="Yeni resim"
                  className="w-20 h-20 object-cover rounded border-2 border-indigo-500"
                />
              )}
              {/* Mevcut resim */}
              {!image && currentImageUrl && (
                <img
                  src={currentImageUrl}
                  alt="Mevcut resim"
                  className="w-20 h-20 object-cover rounded border-2 border-gray-500"
                />
              )}
            </div>
          </motion.div>

          {/* Butonlar */}
          <motion.div
            className="flex justify-between"
            variants={{
              hidden: { x: -20, opacity: 0 },
              visible: { x: 0, opacity: 1 },
            }}
          >
            <button
              onClick={() => navigate("/dashboard/products")}
              className="px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-all disabled:opacity-50"
              disabled={isUpdating}
            >
              İptal
            </button>
            <button
              onClick={handleUpdate}
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center gap-2"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <motion.div
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  Güncelleniyor...
                </>
              ) : (
                "Güncelle"
              )}
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default EditProduct;
