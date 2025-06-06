import { FaLock, FaUser } from "react-icons/fa";

const Login = () => {
  return (
    <>
      <section id="login">
        <div>
          <div className="fixed top-0 left-0 h-full w-1/2 bg-white shadow-lg flex items-center justify-center">
            <img src="images/login/bg-login.png" alt="" />
          </div>
          <div className="fixed top-0 right-0 h-full w-1/2 flex flex-col items-center justify-center min-h-screen bg-gray-200 shadow-[inset_16px_0_24px_-16px_rgba(0,0,0,0.15)]">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
              <div className="flex justify-center mb-6">
                <span className="text-4xl text-gray-600">
                  <i className="ri-login-circle-line">Automation System</i>
                </span>
              </div>
              <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
                <FaUser /> Giriş Yap
              </h2>
              <form className="space-y-5">
                <div>
                  <label className="block text-gray-700 mb-1" htmlFor="email">
                    Email
                  </label>
                  <div className="flex items-center rounded-lg bg-gray-100 transition shadow-sm px-3 py-2 focus-within:bg-gray-200 hover:bg-gray-200">
                    <span className="text-gray-400 mr-2">
                      <i className="ri-mail-line"></i>
                    </span>
                    <input
                      type="email"
                      id="email"
                      className="w-full outline-none bg-transparent"
                      placeholder="Email adresinizi girin"
                    />
                  </div>
                </div>
                <div>
                  <label
                    className="block text-gray-700 mb-1"
                    htmlFor="password"
                  >
                    Şifre
                  </label>
                  <div className="flex items-center rounded-lg bg-gray-100 transition shadow-sm px-3 py-2 focus-within:bg-gray-200 hover:bg-gray-200">
                    <span className="text-gray-400 mr-2">
                      <i className="ri-lock-2-line"></i>
                    </span>
                    <input
                      type="password"
                      id="password"
                      className="w-full outline-none bg-transparent"
                      placeholder="Şifrenizi girin"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition flex items-center justify-center gap-2"
                >
                  <FaLock />
                  Giriş Yap
                </button>
              </form>
              <div className="mt-4 text-center">
                <a
                  href="#"
                  className="font-medium px-3 py-2 hover:underline hover:text-gray-600 transition text-sm"
                >
                  Şifrenizi mi unuttunuz?
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
