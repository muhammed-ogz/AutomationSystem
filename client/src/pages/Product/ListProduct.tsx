import { motion } from "framer-motion";
import { MdOutlineDelete, MdOutlineEditNote } from "react-icons/md";

const products = [
  {
    id: 1,
    name: "Dizüstü Bilgisayar",
    price: "₺15.000",
    stock: 20,
    image: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    name: "Akıllı Telefon",
    price: "₺8.500",
    stock: 15,
    image: "https://via.placeholder.com/150",
  },
  {
    id: 3,
    name: "Kablosuz Kulaklık",
    price: "₺1.200",
    stock: 50,
    image: "https://via.placeholder.com/150",
  },
];

const ListProduct = () => {
  return (
    <section id="list-product" className="m-10">
      <div>
        <motion.h1
          className="text-3xl font-bold mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Ürün Listesi
        </motion.h1>
        <motion.div
          className="grid grid-cols-1 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } },
          }}
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              className="bg-gray-500 rounded-lg shadow-md p-4 flex items-center gap-4 hover:bg-gray-400 transition-colors group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              {/* Ürün Resmi */}
              <div className="flex-shrink-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded"
                />
              </div>
              {/* Ürün Bilgileri */}
              <div className="flex-grow">
                <h2 className="text-lg font-semibold text-gray-100 mb-1 group-hover:text-white transition-colors">
                  {product.name}
                </h2>
                <p className="text-gray-200 mb-1">Fiyat: {product.price}</p>
                <p className="text-gray-200">
                  Stok Adeti: {product.stock} adet
                </p>
              </div>
              {/* Butonlar */}
              <div className="flex flex-col gap-2">
                <motion.button
                  onClick={() =>
                    (window.location.href = `/products/edit/${product.id}`)
                  }
                  className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-blue-500 transition-colors text-sm flex items-center gap-1"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MdOutlineEditNote className="text-lg" />
                  Düzenle
                </motion.button>
                <motion.button
                  className="px-3 py-1 bg-amber-700 text-white rounded hover:bg-red-700 transition-colors text-sm flex items-center gap-1"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => alert(`Ürün ${product.id} silindi!`)}
                >
                  <MdOutlineDelete className="text-lg" />
                  Sil
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ListProduct;
