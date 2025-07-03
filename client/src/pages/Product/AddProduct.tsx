import { useState } from "react";
import { AiOutlineLoading3Quarters, AiOutlineUpload } from "react-icons/ai";

const AddProduct = () => {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState<string | ArrayBuffer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [companyId, setCompanyId] = useState(""); // CompanyId için

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

  const handleSubmit = async () => {
    // Validation
    if (!productName || !price || !stock) {
      setMessage("Lütfen tüm alanları doldurunuz!");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const productData = {
        CompanyId: companyId,
        ProductName: productName,
        ProductPrice: parseFloat(price),
        ProductQuantity: parseInt(stock),
        ProductImage: image ? image.toString() : "null",
      };

      const response = await fetch("http://localhost:5000/add-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        setMessage("Ürün başarıyla kaydedildi! ✅");

        // Form'u temizle
        setProductName("");
        setPrice("");
        setStock("");
        setImage(null);
        setCompanyId("");

        // File input'u temizle
        const fileInput = document.getElementById(
          "product-image"
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      } else {
        const errorData = await response.json();
        setMessage(`Hata: ${errorData.message || "Bir hata oluştu!"}`);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setMessage("Sunucuya bağlanırken bir hata oluştu!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="edit-product" className="m-10">
      <div className="bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-2xl mx-auto">
        <h1 className="text-3xl font-semibold text-white mb-6">🛠️ Ürün Ekle</h1>

        {/* Message */}
        {message && (
          <div
            className={`mb-4 p-3 rounded-lg ${
              message.includes("başarıyla")
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {message}
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-6">
          {/* Ürün Adı */}
          <div>
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
              placeholder="Mesela: Akıllı Telefon"
              className="mt-1 block w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all text-white"
            />
          </div>

          {/* Ürün Fiyatı ve Stok */}
          <div className="flex gap-4">
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
                className="mt-1 block w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all text-white"
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
                className="mt-1 block w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all text-white"
              />
            </div>
          </div>

          {/* Resim Yükleme */}
          <div>
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
          </div>

          {/* Kaydet Butonu */}
          <div className="text-right">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`px-6 py-3 font-medium rounded-lg transition-all flex items-center gap-2 ml-auto ${
                isLoading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } text-white`}
            >
              {isLoading && (
                <AiOutlineLoading3Quarters className="animate-spin" />
              )}
              {isLoading ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddProduct;
