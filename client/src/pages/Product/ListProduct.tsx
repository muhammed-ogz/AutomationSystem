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
        <h1 className="text-3xl font-bold mb-4">Ürün Listesi</h1>
        <div className="grid grid-cols-1 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-gray-100 rounded-lg shadow-md p-4 flex items-center gap-4 hover:bg-gray-200 transition"
            >
              {/* Ürün Resmi */}
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 object-cover rounded"
              />
              {/* Ürün Bilgileri */}
              <div className="flex-grow">
                <h2 className="text-lg font-semibold text-gray-800 mb-1">
                  {product.name}
                </h2>
                <p className="text-gray-600 mb-1">Fiyat: {product.price}</p>
                <p className="text-gray-600">Stok: {product.stock} adet</p>
              </div>
              {/* Butonlar */}
              <div className="flex flex-col gap-2">
                <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                  Düzenle
                </button>
                <button className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm">
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ListProduct;
