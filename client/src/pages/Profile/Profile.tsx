const Profile = () => {
  return (
    <>
      <section id="profile">
        <div className="m-10 bg-gray-950 rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-semibold text-gray-200 mb-6">
            Profilinizi Görüntüleyin
          </h1>
          <div className="mb-8 p-6 bg-gray-800/30 rounded-2xl border border-gray-750/50 backdrop-blur-sm">
            <h2 className="text-2xl font-semibold text-gray-200 mb-6">
              Firma bilgileri
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label
                  htmlFor="username"
                  className="text-sm font-medium text-gray-300 mb-1"
                >
                  Firma Adı
                </label>
                <input
                  type="text"
                  id="username"
                  className="p-2 bg-gray-700 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-300 mb-1"
                >
                  E-posta
                </label>
                <input
                  type="email"
                  id="email"
                  className="p-2 bg-gray-700 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="ipAddress"
                  className="text-sm font-medium text-gray-300 mb-1"
                >
                  Bağlı olunan IP adresi
                </label>
                <input
                  type="text"
                  id="ipAddress"
                  className="p-2 bg-gray-700 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="role"
                  className="text-sm font-medium text-gray-300 mb-1"
                >
                  Yetki Düzeyi
                </label>
                <input
                  type="text"
                  id="role"
                  className="p-2 bg-gray-700 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="text-gray-500 text-sm mt-4">
              <h3 className="text-xl mb-4">Detaylı Bilgiler : </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Yukarıdaki bilgiler size ait hassas bilgilerdir. Lütfen bu
                  bilgileri kimseyle paylaşmayın.
                </li>
                <li>
                  Yetki düzeyiniz, sistemdeki erişim haklarınızı belirler.
                  Yöneticiler tüm sistem ayarlarına erişebilirken, normal
                  kullanıcılar sadece kendi verilerine erişebilir.
                </li>
                <li>
                  IP adresiniz, sistemdeki oturum açma işlemlerinizin
                  güvenliğini artırmak ve veritabanı erişim ayarları için
                  kullanılır. Bu bilgi, hesabınızın güvenliğini sağlamak
                  amacıyla saklanır.
                </li>
                <li>
                  E-posta adresiniz, sistemle ilgili bildirimler ve şifre
                  sıfırlama işlemleri için kullanılır. Lütfen geçerli bir
                  e-posta adresi girin.
                </li>
                <li>
                  Kullanıcı adınız, sistemdeki kimliğinizi temsil eder. Bu
                  bilgi, diğer kullanıcılarla etkileşimlerinizde kullanılır.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;
