export default function Footer() {
  return (
    <footer className="mt-20 border-t border-gray-200 bg-white/70 backdrop-blur-md">
      
      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">
        
        {/* Brand */}
        <div>
          <h2 className="text-xl font-bold mb-4">InsightBiz</h2>
          <p className="text-gray-600 text-sm">
            ЖДҮ-д зориулсан data-driven платформ. Бизнесээ илүү ухаалаг удирд.
          </p>
        </div>

        {/* Product */}
        <div>
          <h3 className="font-semibold mb-4">Product</h3>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li><a href="#features" className="hover:text-black">Features</a></li>
            <li><a href="#" className="hover:text-black">Pricing</a></li>
            <li><a href="#" className="hover:text-black">Demo</a></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li><a href="#" className="hover:text-black">About</a></li>
            <li><a href="#" className="hover:text-black">Contact</a></li>
            <li><a href="#" className="hover:text-black">Careers</a></li>
          </ul>
        </div>

        {/* CTA / Newsletter */}
        <div>
          <h3 className="font-semibold mb-4">Start</h3>
          <p className="text-gray-600 text-sm mb-4">
            Шинэ боломжийг эхлүүлэх
          </p>

          <div className="flex">
            <input
              type="email"
              placeholder="Имэйл хаяг"
              className="px-4 py-2 w-full border rounded-l-xl text-sm focus:outline-none"
            />
            <button className="bg-indigo-600 text-white px-4 rounded-r-xl text-sm">
              Join
            </button>
          </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="border-t border-gray-200 py-6 text-center text-sm text-gray-500">
        © 2026 InsightBiz. All rights reserved.
      </div>

    </footer>
  )
}