import { motion } from 'framer-motion'
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Brush,
} from 'recharts'

const data = [
  { month: 'Ocak', sales: 120, returns: 30 },
  { month: 'Şubat', sales: 150, returns: 45 },
  { month: 'Mart', sales: 200, returns: 60 },
  { month: 'Nisan', sales: 180, returns: 50 },
  { month: 'Mayıs', sales: 220, returns: 70 },
  { month: 'Haziran', sales: 250, returns: 80 },
]

const Statistics = () => {
  return (
    <section id='statistics' className='m-10'>
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
            visible: { transition: { staggerChildren: 0.15 } },
          }}
        >
          {[
            { title: 'Toplam Ürün', value: '235' },
            { title: 'Toplam Satış Adedi', value: '8,120' },
            { title: 'Toplam İade Adedi', value: '335' },
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

        {/* Grafik: Satış ve İade Adetleri */}
        <motion.div
          className='bg-gray-800 rounded-lg shadow-md p-6'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h2 className='text-2xl font-semibold mb-4 text-center'>Aylık Satış ve İade Adetleri</h2>
          <ResponsiveContainer width='100%' height={350}>
            <LineChart data={data} margin={{ top: 20, right: 40, left: 0, bottom: 20 }}>
              <CartesianGrid stroke='#444' strokeDasharray='5 5' />
              <XAxis dataKey='month' tick={{ fill: '#ccc' }} axisLine={{ stroke: '#ccc' }} tickLine={{ stroke: '#ccc' }} />
              <YAxis tick={{ fill: '#ccc' }} axisLine={{ stroke: '#ccc' }} tickLine={{ stroke: '#ccc' }} />
              <Tooltip
                formatter={(value) => `${value.toLocaleString('tr-TR')} adet`}
                contentStyle={{ backgroundColor: '#2d2d2d', border: 'none' }}
                itemStyle={{ color: '#fff' }}
                cursor={{ stroke: '#8884d8' }}
              />
              <Legend wrapperStyle={{ color: '#ccc' }} />
              <Line
                type='monotone'
                dataKey='sales'
                name='Satış Adedi'
                stroke='#4f46e5'
                strokeWidth={3}
                dot={{ r: 4, stroke: '#4f46e5', fill: '#4f46e5' }}
                activeDot={{ r: 6 }}
                animationDuration={1500}
              />
              <Line
                type='monotone'
                dataKey='returns'
                name='İade Adedi'
                stroke='#ec4899'
                strokeWidth={3}
                dot={{ r: 4, stroke: '#ec4899', fill: '#ec4899' }}
                activeDot={{ r: 6 }}
                animationDuration={1500}
              />
              <Brush dataKey='month' height={30} stroke='#8884d8' fill='#333' />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Statistics