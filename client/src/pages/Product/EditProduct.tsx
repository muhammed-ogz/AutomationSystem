import { motion } from "framer-motion";
import { useState } from "react";
import { AiOutlineUpload } from "react-icons/ai";

const EditProduct = () => {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState<string | ArrayBuffer | null>(null);

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

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
          🛠️ Ürünleri Düzenle
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
                className="mt-1 block w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:animate-pulse transition-all"
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
                className="mt-1 block w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:animate-pulse transition-all"
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
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-md cursor-pointer hover:bg-gray-600 transition"
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
              />
              {typeof image === "string" && (
                <img
                  src={image}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded"
                />
              )}
            </div>
          </motion.div>

          {/* Kaydet Butonu */}
          <motion.div
            className="text-right"
            variants={{
              hidden: { x: -20, opacity: 0 },
              visible: { x: 0, opacity: 1 },
            }}
          >
            <button
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all"
              onClick={() => alert("Ürün kaydedildi!")} // Değiştir
            >
              Kaydet
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default EditProduct;
