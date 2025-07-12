import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState, type JSX } from "react";
import { FaBox } from "react-icons/fa";
import {
  MdAdd,
  MdFilterList,
  MdInventory,
  MdOutlineDelete,
  MdOutlineEditNote,
  MdSearch,
  MdTrendingDown,
  MdTrendingUp,
  MdWarning,
} from "react-icons/md";
import { toast } from "react-toastify";

// Type Definitions
interface Product {
  _id: string; // Backend'den string geliyor
  name: string;
  price: string;
  priceNumber: number;
  stock: number;
  category: string;
  image: string;
  status: "in-stock" | "low-stock" | "out-of-stock";
  trend: "up" | "down" | "stable";
}

// Backend'den gelen veri yapısı
interface BackendProduct {
  _id: string;
  CompanyId: string;
  ProductName: string;
  ProductPrice: number;
  ProductQuantity: number;
  ProductImage: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface BackendResponse {
  success: boolean;
  message: string;
  products: BackendProduct[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

interface ProductCardProps {
  product: Product;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

interface FilterState {
  search: string;
  category: string;
  sortBy: "name" | "price" | "stock";
  sortOrder: "asc" | "desc";
}

const ListProduct: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [filter, setFilter] = useState<FilterState>({
    search: "",
    category: "",
    sortBy: "name",
    sortOrder: "asc",
  });

  // Backend verisini frontend formatına dönüştüren fonksiyon
  const transformBackendProduct = (backendProduct: BackendProduct): Product => {
    const stock = backendProduct.ProductQuantity;
    const price = backendProduct.ProductPrice;

    // Stok durumunu belirleme
    let status: Product["status"];
    if (stock === 0) {
      status = "out-of-stock";
    } else if (stock <= 10) {
      status = "low-stock";
    } else {
      status = "in-stock";
    }

    // Basit kategori belirleme (ProductName'den tahmin)
    let category = "Genel";
    const productName = backendProduct.ProductName.toLowerCase();
    if (productName.includes("telefon") || productName.includes("iphone")) {
      category = "Elektronik";
    } else if (
      productName.includes("koltuk") ||
      productName.includes("takım")
    ) {
      category = "Mobilya";
    } else if (productName.includes("çakmak")) {
      category = "Aksesuar";
    }

    return {
      _id: backendProduct._id,
      name: backendProduct.ProductName,
      price: `₺${price.toLocaleString("tr-TR")}`,
      priceNumber: price,
      stock: stock,
      category: category,
      image:
        backendProduct.ProductImage === "null"
          ? "/placeholder-product.jpg"
          : backendProduct.ProductImage,
      status: status,
      trend: "stable", // Şimdilik stable, gelecekte trend hesaplama eklenebilir
    };
  };

  const getStatusColor = (status: Product["status"]): string => {
    switch (status) {
      case "in-stock":
        return "from-emerald-500/20 to-green-500/20 border-emerald-500/30";
      case "low-stock":
        return "from-amber-500/20 to-orange-500/20 border-amber-500/30";
      case "out-of-stock":
        return "from-red-500/20 to-rose-500/20 border-red-500/30";
      default:
        return "from-gray-500/20 to-gray-600/20 border-gray-500/30";
    }
  };

  const getStatusText = (status: Product["status"]): string => {
    switch (status) {
      case "in-stock":
        return "Stokta";
      case "low-stock":
        return "Az Stok";
      case "out-of-stock":
        return "Tükendi";
      default:
        return "Bilinmiyor";
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_SERVER}/inventories`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        toast.error("Ürünler getirilirken bir hata oluştu.");
        return;
      }

      const data: BackendResponse = await response.json();
      console.log("API Response:", data);

      if (data.success && data.products) {
        // Backend verisini frontend formatına dönüştür
        const transformedProducts = data.products.map(transformBackendProduct);
        setProducts(transformedProducts);
      } else {
        toast.error("Ürün verisi bulunamadı.");
        setProducts([]);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      toast.error("Ürünler getirilirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (id: string) => {
    window.location.href = `/dashboard/products/edit/${id}`;
  };

  const handleDelete = async (id: string) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error("Lütfen giriş yapın.");
      return;
    }
    if (window.confirm("Bu ürünü silmek istediğinize emin misiniz?")) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_SERVER}/products/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          toast.error(`Ürün silinirken bir hata oluştu: ${errorData.message}`);
          return;
        }
        setProducts((prev) => prev.filter((product) => product._id !== id));
        toast.success("Ürün başarıyla silindi.");
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error(
          "Ürün silinirken bir hata oluştu. Lütfen daha sonra tekrar deneyin."
        );
      }
    }
  };

  const handleView = (id: string) => {
    window.location.href = `/products/view/${id}`;
  };

  const getTrendIcon = (trend: Product["trend"]): JSX.Element => {
    switch (trend) {
      case "up":
        return <MdTrendingUp className="text-green-400" />;
      case "down":
        return <MdTrendingDown className="text-red-400" />;
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full"></div>;
    }
  };

  const filteredProducts = products
    .filter(
      (product) =>
        product.name &&
        product.name.toLowerCase().includes(filter.search.toLowerCase()) &&
        (filter.category === "" || product.category === filter.category)
    )
    .sort((a, b) => {
      let comparison = 0;
      switch (filter.sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "price":
          comparison = a.priceNumber - b.priceNumber;
          break;
        case "stock":
          comparison = a.stock - b.stock;
          break;
      }
      return filter.sortOrder === "asc" ? comparison : -comparison;
    });

  const categories = Array.from(new Set(products.map((p) => p.category)));

  // Loading komponenti
  const LoadingSpinner = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-16"
    >
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
        <div
          className="absolute inset-0 w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"
          style={{ animationDelay: "0.15s" }}
        ></div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 text-center"
      >
        <h3 className="text-xl font-semibold text-white mb-2">
          Ürünler Yükleniyor...
        </h3>
        <p className="text-gray-400">Lütfen bekleyin, veriler getiriliyor</p>
      </motion.div>
    </motion.div>
  );

  const ProductCard: React.FC<ProductCardProps> = ({ product, onDelete }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      whileHover={{ y: -5 }}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${getStatusColor(
        product.status
      )} 
        backdrop-blur-sm border-2 p-6 transition-all duration-300 hover:shadow-2xl 
        hover:shadow-purple-500/10 group`}
    >
      {/* Status Badge */}
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        <div
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            product.status === "in-stock"
              ? "bg-emerald-500/20 text-emerald-300"
              : product.status === "low-stock"
              ? "bg-amber-500/20 text-amber-300"
              : "bg-red-500/20 text-red-300"
          }`}
        >
          {getStatusText(product.status)}
        </div>
        {getTrendIcon(product.trend)}
      </div>

      {/* Low Stock Warning */}
      {product.status === "low-stock" && (
        <div className="absolute top-4 left-4">
          <MdWarning className="text-amber-400 text-xl animate-pulse" />
        </div>
      )}

      <div className="flex items-start space-x-4">
        {/* Product Image */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="relative flex-shrink-0"
        >
          <div className="w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800 shadow-lg">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src =
                  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik0xMiA5QzEwLjM0IDkgOSAxMC4zNCA5IDEyUzEwLjM0IDE1IDEyIDE1IDE1IDEzLjY2IDE1IDEyIDEzLjY2IDkgMTIgOVpNMTIgMTNDMTEuNDUgMTMgMTEgMTIuNTUgMTEgMTJTMTEuNDUgMTEgMTIgMTFTMTMgMTEuNDUgMTMgMTJTMTIuNTUgMTMgMTIgMTNaIiBmaWxsPSIjNkI3Mjg5Ii8+CjxwYXRoIGQ9Ik0xMiA2QzE0LjIxIDYgMTYgNy43OSAxNiAxMFMxNC4yMSAxNCAxMiAxNEMxMC4zNiAxNCA4Ljk0IDEzLjM3IDcuOTQgMTIuMzZMOC42NSAxMS42NEM5LjM1IDEyLjM1IDEwLjYxIDEyLjc5IDEyIDEyLjc5QzEzLjU3IDEyLjc5IDE0Ljg1IDExLjUxIDE0Ljg1IDEwUzEzLjU3IDcuMjEgMTIgNy4yMVMxMC4zNSA4LjQ5IDEwLjM1IDEwSCA5LjE1QzkuMTUgNy43OSAxMC43OSA2IDEyIDZaIiBmaWxsPSIjNkI3Mjg5Ii8+Cjwvc3ZnPgo=";
              }}
            />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <FaBox className="text-white text-xs" />
          </div>
        </motion.div>

        {/* Product Info */}
        <div className="flex-grow">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">
                {product.name}
              </h3>
              <p className="text-sm text-gray-400 font-medium mb-1">
                {product.category}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {product.price}
            </div>
            <div className="flex items-center space-x-2">
              <MdInventory className="text-gray-400" />
              <span
                className={`font-semibold ${
                  product.stock > 10
                    ? "text-green-400"
                    : product.stock > 0
                    ? "text-amber-400"
                    : "text-red-400"
                }`}
              >
                {product.stock} adet
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-700/50 rounded-full h-2 mb-4">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                product.stock > 20
                  ? "bg-gradient-to-r from-green-500 to-emerald-500"
                  : product.stock > 10
                  ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                  : product.stock > 0
                  ? "bg-gradient-to-r from-orange-500 to-red-500"
                  : "bg-gradient-to-r from-red-500 to-red-700"
              }`}
              style={{ width: `${Math.min((product.stock / 50) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2 mt-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() =>
            (window.location.href = `/dashboard/products/edit/${product._id}`)
          }
          className="p-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-all duration-200 backdrop-blur-sm border border-purple-500/30"
        >
          <MdOutlineEditNote className="text-lg" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onDelete(product._id)}
          className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all duration-200 backdrop-blur-sm border border-red-500/30"
        >
          <MdOutlineDelete className="text-lg" />
        </motion.button>
      </div>
    </motion.div>
  );

  return (
    <section id="list-product" className="m-10">
      <div className="bg-gradient-to-br from-gray-950 to-gray-900 rounded-3xl p-8 border border-gray-800/50 backdrop-blur-sm">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <MdInventory className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Ürün Listesi
              </h1>
              <p className="text-gray-400 mt-1">
                {loading
                  ? "Yükleniyor..."
                  : `Toplam ${products.length} ürün • ${filteredProducts.length} görüntüleniyor`}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-green-500/25 transition-all duration-300"
              onClick={() => (window.location.href = "/report")}
            >
              <MdAdd className="text-xl" />
              <span>Rapor Çıkart</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => (window.location.href = "/dashboard/products/add")}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-green-500/25 transition-all duration-300"
            >
              <MdAdd className="text-xl" />
              <span>Yeni Ürün</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-wrap items-center gap-4 mb-4">
            {/* Search */}
            <div className="relative flex-grow max-w-md">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Ürün ara..."
                value={filter.search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFilter((prev) => ({ ...prev, search: e.target.value }))
                }
                className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
              />
            </div>

            {/* Filter Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-300 hover:border-blue-500/50 transition-all duration-300"
            >
              <MdFilterList />
              <span>Filtrele</span>
            </motion.button>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <select
                    value={filter.category}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setFilter((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    <option value="">Tüm Kategoriler</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>

                  <select
                    value={filter.sortBy}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setFilter((prev) => ({
                        ...prev,
                        sortBy: e.target.value as FilterState["sortBy"],
                      }))
                    }
                    className="px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    <option value="name">İsme Göre</option>
                    <option value="price">Fiyata Göre</option>
                    <option value="stock">Stoka Göre</option>
                  </select>

                  <select
                    value={filter.sortOrder}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setFilter((prev) => ({
                        ...prev,
                        sortOrder: e.target.value as FilterState["sortOrder"],
                      }))
                    }
                    className="px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    <option value="asc">Artan</option>
                    <option value="desc">Azalan</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <LoadingSpinner />
        ) : (
          <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnimatePresence>
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProductCard
                    product={product}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl text-gray-600 mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              Ürün bulunamadı
            </h3>
            <p className="text-gray-500">
              Arama kriterlerinizi değiştirmeyi deneyin
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ListProduct;
