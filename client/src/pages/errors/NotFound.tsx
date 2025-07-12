const NotFound = () => {
  return (
    <>
      <section
        id="not-found"
        className="flex flex-col items-center justify-center h-screen bg-gray-950"
      >
        <div className="">
          <h1 className="text-4xl text-gray-300">404 - Sayfa Bulunamadı</h1>
          <p className="text-gray-400 mt-4">
            Bu sayfa mevcut değil veya yanlış bir URL girdiniz. Lütfen adresi
            kontrol edin veya ana sayfaya dönün.
          </p>
          <a
            href="/"
            className="mt-8 inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-gray-200 hover:from-gray-600 hover:to-gray-800 shadow-lg transition-all duration-200 group"
          >
            <span className="mr-3 flex items-center justify-center w-6 h-6 rounded-full bg-gray-800 group-hover:bg-gray-700 transition-colors">
              <svg
                className="w-4 h-4 text-gray-300 group-hover:text-gray-100"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </span>
            Ana Sayfaya Dön
          </a>
        </div>
      </section>
    </>
  );
};

export default NotFound;
