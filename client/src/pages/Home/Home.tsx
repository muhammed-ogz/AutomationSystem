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
const currencyFormatter = (value : any) => `${value.toLocaleString('tr-TR')}₺`;
type CustomTooltipProps = TooltipProps<number, string>;

const CustomTooltip = ({ active, payload , label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border rounded shadow-md">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((entry : any) => (
          <p key={entry.name} className="text-sm">
            {`${entry.name}: ${entry.value.toLocaleString('tr-TR')}₺`}
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
      <section id="home" className="m-10">
        <div>
          <h1 className="text-3xl font-semibold mb-5">Hoş Geldiniz!</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-100 p-4 rounded-lg shadow-md flex items-center gap-4">
            <FaUser className="text-blue-500 text-4xl" />
            <div>
              <p className="text-xl font-semibold">235</p>
              <p className="text-gray-600">Kayıtlı Ürün</p>
                <button 
                  onClick={() => window.location.href = "/products"}
                  className="bg-blue-400 p-2 mt-2 rounded-lg text-gray-600 text-sm hover:bg-blue-500 transition-colors duration-300"
                >
                  Ürün Listesini Görüntüle
                </button>
            </div>
          </div>
          <div className="bg-green-100 p-4 rounded-lg shadow-md flex items-center gap-4">
            <FaShoppingCart className="text-green-500 text-4xl" />
            <div>
              <p className="text-xl font-semibold">8,120</p>
              <p className="text-gray-600">Toplam Satış Adeti</p>
              <button className="bg-green-400 p-2 mt-2 rounded-lg text-gray-600 text-sm hover:bg-green-500">Satışları görüntüle</button>
            </div>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg shadow-md flex items-center gap-4">
            <FaChartBar className="text-yellow-500 text-4xl" />
            <div>
              <p className="text-xl font-semibold">₺234,567</p>
              <p className="text-gray-600">Gelir</p>
              <button className="bg-yellow-400 p-2 mt-2 rounded-lg text-gray-600 text-sm hover:bg-yellow-500">Geliri görüntüle</button>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Satış ve Gider İstatistikleri</h2>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data} margin={{ top: 20, right: 40, left: 0, bottom: 20 }}>
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <XAxis dataKey="month">
                <Label value="Aylar" position="bottom" offset={0} />
              </XAxis>
              <YAxis tickFormatter={currencyFormatter} width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} />
              {/* Satış miktarı */}
              <Line type="monotone" dataKey="sales" name="Satış" stroke="#8884d8" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
              {/* Gider miktarı */}
              <Line type="monotone" dataKey="expense" name="Gider" stroke="#82ca9d" strokeWidth={3} dot={{ r: 5 }} />
              {/* Zaman çizgisi kaydırıcı */}
              <Brush dataKey="month" height={30} stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </>
  );
};

export default Home;
