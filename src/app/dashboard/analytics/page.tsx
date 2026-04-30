"use client"

export default function Analytics() {
  return (
    <div className="p-6 max-w-7xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">Analytics</h1>

      <div className="grid md:grid-cols-2 gap-6">

        {/* Chart 1 */}
        <div className="bg-white/60 backdrop-blur border rounded-2xl p-6 shadow">
          <h2 className="font-semibold mb-4">Хэрэглэгчийн өсөлт</h2>
          <div className="h-40 flex items-center justify-center text-gray-400">
            📈 Chart
          </div>
        </div>

        {/* Chart 2 */}
        <div className="bg-white/60 backdrop-blur border rounded-2xl p-6 shadow">
          <h2 className="font-semibold mb-4">Орлогын тренд</h2>
          <div className="h-40 flex items-center justify-center text-gray-400">
            📊 Chart
          </div>
        </div>

      </div>

      {/* Insights */}
      <div className="mt-6 bg-white/60 backdrop-blur border rounded-2xl p-6 shadow">
        <h2 className="font-semibold mb-4">Insights</h2>

        <ul className="space-y-2 text-gray-600">
          <li>✔ 25-34 насны хэрэглэгч хамгийн их</li>
          <li>✔ Баасан гаригт орлого хамгийн өндөр</li>
          <li>✔ Шинэ хэрэглэгч 12% өссөн</li>
        </ul>
      </div>

    </div>
  )
}