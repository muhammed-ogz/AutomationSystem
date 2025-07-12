import { motion } from 'framer-motion'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Brush } from 'recharts'

const data = [
  { month: 'Ocak', sales: 4000, expenses: 2400 },
  { month: 'Şubat', sales: 3000, expenses: 1398 },
  { month: 'Mart', sales: 5000, expenses: 2800 },
  { month: 'Nisan', sales: 4000, expenses: 3908 },
  { month: 'Mayıs', sales: 6000, expenses: 4800 },
  { month: 'Haziran', sales: 7000, expenses: 5800 },
];

const currencyFormatter = (value : any) => `${value.toLocaleString('tr-TR')}₺`;

const Revenue = () => {
  return (
    <section id='revenue' className='m-10'>
      <motion.div
        className='bg-gray-950 rounded-lg p-10 text-gray-300 min-h-screen'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className='text-3xl font-bold mb-6'
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          İstatistikler
        </motion.h1>
        <motion.div
          className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'
          initial='hidden'
          animate='visible'
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } }
          }}
        >
          {/* Cards */}
          {[
            { title: 'Toplam Ürün', value: '235' },
            { title: 'Toplam Satış', value: '8,120' },
            { title: 'Toplam Gelir', value: '₺120,000' },
          ].map((card, idx) => (
            <motion.div
              key={idx}
              className='bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center justify-center hover:bg-gray-700 transition-colors group'
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: idx * 0.2 }}
            >
              <h2 className='text-2xl font-semibold mb-2'>{card.title}</h2>
              <p className='text-4xl font-bold'>{card.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Grafik */}
        <motion.div
          className='bg-gray-800 rounded-lg pl-6 shadow-md p-6'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h2 className='text-2xl font-semibold mb-4 text-center'>Satış vs Giderler</h2>
            <ResponsiveContainer width='100%' height={300}>
            <LineChart data={data} margin={{ top: 20, right: 40, left: 30, bottom: 20 }}>
              <CartesianGrid stroke='#444' strokeDasharray='5 5' />
              <XAxis dataKey='month' tick={{ fill: '#ccc' }} axisLine={{ stroke: '#ccc' }} tickLine={{ stroke: '#ccc' }} />
              <YAxis
              tickFormatter={currencyFormatter}
              tick={{ fill: '#ccc' }}
              axisLine={{ stroke: '#ccc' }}
              tickLine={{ stroke: '#ccc' }}
              domain={['auto', 'auto']}
              padding={{ top: 20, bottom: 0 }}
              />
              <Tooltip formatter={(value) => currencyFormatter(value)} contentStyle={{ backgroundColor: '#2d2d2d', border: 'none' }} itemStyle={{ color: '#fff' }} cursor={{ stroke: '#8884d8' }} />
              <Legend wrapperStyle={{ color: '#ccc' }} />
              <Line type='monotone' dataKey='sales' name='Satış' stroke='#4f46e5' strokeWidth={3} dot={{ r: 4, stroke: '#4f46e5', fill: '#4f46e5' }} activeDot={{ r: 6 }} animationDuration={1500} />
              <Line type='monotone' dataKey='expenses' name='Gider' stroke='#ec4899' strokeWidth={3} dot={{ r: 4, stroke: '#ec4899', fill: '#ec4899' }} activeDot={{ r: 6 }} animationDuration={1500} />
              <Brush dataKey='month' height={30} stroke='#8884d8' fill='#333' tickFormatter={(month) => month} />
            </LineChart>
            </ResponsiveContainer>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Revenue;