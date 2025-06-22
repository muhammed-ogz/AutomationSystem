import { AnimatePresence, motion } from "framer-motion";
import React, { useState, type JSX } from "react";
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

// Type Definitions
interface Product {
  id: number;
  name: string;
  price: string;
  priceNumber: number;
  stock: number;
  category: string;
  image: string;
  status: "in-stock" | "low-stock" | "out-of-stock";
  trend: "up" | "down" | "stable";
}

interface ProductCardProps {
  product: Product;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
}

interface FilterState {
  search: string;
  category: string;
  sortBy: "name" | "price" | "stock";
  sortOrder: "asc" | "desc";
}

// Mock Data
const products: Product[] = [
  {
    id: 1,
    name: "MacBook Pro M3",
    price: "₺65.000",
    priceNumber: 65000,
    stock: 8,
    category: "Laptop",
    image: "https://via.placeholder.com/150/667eea/ffffff?text=MacBook",
    status: "low-stock",
    trend: "up",
  },
  {
    id: 2,
    name: "iPhone 15 Pro Max",
    price: "₺48.500",
    priceNumber: 48500,
    stock: 25,
    category: "Telefon",
    image: "https://via.placeholder.com/150/f093fb/ffffff?text=iPhone",
    status: "in-stock",
    trend: "up",
  },
  {
    id: 3,
    name: "AirPods Pro 2",
    price: "₺6.200",
    priceNumber: 6200,
    stock: 0,
    category: "Kulaklık",
    image: "https://via.placeholder.com/150/4facfe/ffffff?text=AirPods",
    status: "out-of-stock",
    trend: "down",
  },
  {
    id: 4,
    name: "iPad Air M2",
    price: "₺22.000",
    priceNumber: 22000,
    stock: 15,
    category: "Tablet",
    image: "https://via.placeholder.com/150/43e97b/ffffff?text=iPad",
    status: "in-stock",
    trend: "stable",
  },
  {
    id: 5,
    name: "Apple Watch Ultra 2",
    price: "₺28.000",
    priceNumber: 28000,
    stock: 3,
    category: "Saat",
    image: "https://via.placeholder.com/150/fbbf24/ffffff?text=Watch",
    status: "low-stock",
    trend: "up",
  },
];

const ListProduct: React.FC = () => {
  const [filter, setFilter] = useState<FilterState>({
    search: "",
    category: "",
    sortBy: "name",
    sortOrder: "asc",
  });
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const handleEdit = (id: number): void => {
    console.log(`Editing product ${id}`);
    // window.location.href = `/products/edit/${id}`;
  };

  const handleDelete = (id: number): void => {
    console.log(`Deleting product ${id}`);
    // Implement delete logic
  };

  const handleView = (id: number): void => {
    console.log(`Viewing product ${id}`);
    // window.location.href = `/products/${id}`;
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
            (window.location.href = `/products/edit/${product.id}`)
          }
          className="p-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-all duration-200 backdrop-blur-sm border border-purple-500/30"
        >
          <MdOutlineEditNote className="text-lg" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onDelete(product.id)}
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
                Toplam {products.length} ürün • {filteredProducts.length}{" "}
                görüntüleniyor
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
              onClick={() => (window.location.href = "/products/add")}
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
        <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatePresence>
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
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

        {/* Empty State */}
        {filteredProducts.length === 0 && (
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
