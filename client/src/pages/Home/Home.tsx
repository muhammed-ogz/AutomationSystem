import { FaChartBar, FaUser, FaShoppingCart } from "react-icons/fa";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Label, Brush, Legend, type TooltipProps } from "recharts";

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

const Home: React.FC = () => {
  return (
    <>
      <section id="home" className="m-10 rounded-lg text-gray-300 bg-gray-950 min-h-screen">
        <div className="p-10">
        <div className="justify-center items-center text-center mb-8">
          <h1 className="text-4xl font-semibold mb-5">Hoş Geldiniz!</h1>
          <p className="text-gray-400 text-xl font-semibold">Envanter yönetimi ve stok takip programı</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800 p-4 rounded-lg shadow-md flex items-center gap-4">
            <FaUser className="text-blue-400 text-4xl" />
            <div>
              <p className="text-2xl font-semibold">235</p>
              <p className="text-gray-400">Kayıtlı Ürün</p>
              <button
                onClick={() => window.location.href = "/products"}
                className="bg-blue-600 p-2 mt-2 rounded-lg text-white text-sm hover:bg-blue-500 transition-colors duration-300"
              >
                Ürün Listesini Görüntüle
              </button>
            </div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg shadow-md flex items-center gap-4">
            <FaShoppingCart className="text-green-400 text-4xl" />
            <div>
              <p className="text-2xl font-semibold">8,120</p>
              <p className="text-gray-400">Toplam Satış Adeti</p>
              <button className="bg-green-600 p-2 mt-2 rounded-lg text-white text-sm hover:bg-green-500">
                Satışları görüntüle
              </button>
            </div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg shadow-md flex items-center gap-4">
            <FaChartBar className="text-yellow-400 text-4xl" />
            <div>
              <p className="text-2xl font-semibold">₺234,567</p>
              <p className="text-gray-400">Gelir</p>
              <button className="bg-yellow-600 p-2 mt-2 rounded-lg text-white text-sm hover:bg-yellow-500">
                Geliri görüntüle
              </button>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 text-gray-300 shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Satış ve Gider İstatistikleri</h2>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data} margin={{ top: 20, right: 40, left: 0, bottom: 20 }}>
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
              <Legend verticalAlign="top" height={36} wrapperStyle={{ color: "#ccc" }} />
              <Line
                type="monotone"
                dataKey="sales"
                name="Satış"
                stroke="#8884d8"
                strokeWidth={3}
                dot={{ r: 5, stroke: "#8884d8", fill: "#8884d8" }}
                activeDot={{ r: 8, stroke: "#8884d8", fill: "#8884d8" }}
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
        </div>
      </div>
    </section>
  </>
);
}

export default Home;
