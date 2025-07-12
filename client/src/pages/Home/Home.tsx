import { motion } from "framer-motion";
import { AiFillProduct } from "react-icons/ai";
import { FaChartBar, FaShoppingCart } from "react-icons/fa";
import {
  Brush,
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from "recharts";

const data = [
  { month: "Ocak", sales: 4000 },
  { month: "Şubat", sales: 3000 },
  { month: "Mart", sales: 5000 },
  { month: "Nisan", sales: 4000 },
  { month: "Mayıs", sales: 6000 },
  { month: "Haziran", sales: 7000 },
];

const currencyFormatter = (value: any) => `${value.toLocaleString("tr-TR")}₺`;

type CustomTooltipProps = TooltipProps<number, string>;

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-700 p-3 border border-gray-600 rounded shadow-md text-white">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((entry: any) => (
          <p key={entry.name} className="text-sm">
            {`${entry.name}: ${entry.value.toLocaleString("tr-TR")}₺`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const buttonStyles = {
  blue: "bg-blue-600 hover:bg-blue-500",
  green: "bg-green-600 hover:bg-green-500",
  yellow: "bg-yellow-600 hover:bg-yellow-500",
};

const Home: React.FC = () => {
  return (
    <section
      id="home"
      className="m-10 rounded-lg text-gray-300 bg-gray-950 min-h-screen"
    >
      <motion.div
        className="p-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Başlık */}
        <motion.div
          className="justify-center items-center text-center mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h1 className="text-4xl font-semibold mb-5">Hoş Geldiniz!</h1>
          <p className="text-gray-400 text-xl font-semibold">
            Envanter yönetimi ve stok takip programı
          </p>
        </motion.div>

        {/* İstatistik Kartları */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } },
          }}
        >
          {[
            {
              icon: <AiFillProduct className="text-blue-400 text-4xl" />,
              value: "235",
              label: "Kayıtlı Ürün",
              btnText: "Ürün Listesini Görüntüle",
              btnAction: () => (window.location.href = "/dashboard/products"),
              btnColor: "blue" as keyof typeof buttonStyles,
            },
            {
              icon: <FaChartBar className="text-green-400 text-4xl" />,
              value: "8,120",
              label: "Toplam Satış Adeti",
              btnText: "Satışları İstatistiklerini Görüntüle",
              btnAction: () => (window.location.href = "/dashboard/statistics"),
              btnColor: "green" as keyof typeof buttonStyles,
            },
            {
              icon: <FaShoppingCart className="text-yellow-400 text-4xl" />,
              value: "₺234,567",
              label: "Gelir",
              btnText: "Gelir Detaylarını Görüntüle",
              btnAction: () => (window.location.href = "/dashboard/revenue"),
              btnColor: "yellow" as keyof typeof buttonStyles,
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              className="bg-gray-800 p-4 rounded-lg shadow-md flex items-center gap-4 group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
              whileHover={{ scale: 1.03 }}
            >
              {item.icon}
              <div>
                <p className="text-2xl font-semibold group-hover:text-white transition-colors">
                  {item.value}
                </p>
                <p className="text-gray-400">{item.label}</p>
                <button
                  onClick={item.btnAction}
                  className={`mt-2 p-2 rounded-lg text-white text-sm transition-colors duration-300 ${
                    buttonStyles[item.btnColor]
                  }`}
                >
                  {item.btnText}
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Grafik Bölümü */}
        <motion.div
          className="bg-gray-800 text-gray-300 shadow-md rounded-lg p-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2
            className="text-2xl font-semibold mb-4"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Satış İstatistikleri Özet Görünümü
          </motion.h2>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart
              data={data}
              margin={{ top: 20, right: 40, left: 0, bottom: 20 }}
            >
              <CartesianGrid stroke="#444" strokeDasharray="5 5" />
              <XAxis
                dataKey="month"
                tick={{ fill: "#ccc" }}
                axisLine={{ stroke: "#ccc" }}
                tickLine={{ stroke: "#ccc" }}
              >
                <Label value="Aylar" position="bottom" offset={0} fill="#ccc" />
              </XAxis>
              <YAxis
                tickFormatter={currencyFormatter}
                width={80}
                tick={{ fill: "#ccc" }}
                axisLine={{ stroke: "#ccc" }}
                tickLine={{ stroke: "#ccc" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                height={36}
                wrapperStyle={{ color: "#ccc" }}
              />
              <Line
                type="monotone"
                dataKey="sales"
                name="Satış"
                stroke="#8884d8"
                strokeWidth={3}
                dot={{ r: 5, stroke: "#8884d8", fill: "#8884d8" }}
                activeDot={{ r: 8, stroke: "#8884d8", fill: "#8884d8" }}
                animationDuration={1500}
              />
              <Brush
                dataKey="month"
                height={30}
                stroke="#8884d8"
                fill="#333"
                tickFormatter={(month) => month}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Home;
