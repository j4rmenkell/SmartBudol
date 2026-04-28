import Link from "next/link";

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-sans pb-20 md:pb-8">
      <div className="max-w-6xl mx-auto p-4 md:p-8 pt-8 md:pt-12">
        {/* Header Section */}
        <div className="flex items-center gap-4 md:gap-6 pb-6 md:pb-8 mb-6 md:mb-8 border-b border-[#bccac1]/30">
          <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-[#00694c] to-[#008560] flex items-center justify-center text-xl md:text-3xl font-bold text-white shadow-xl shadow-emerald-900/10">
            MS
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-[#191c1e]">
              Maria Santos
            </h1>
            <p className="text-[#3d4943] text-sm md:text-base mt-1">
              maria.santos@example.com
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Navigation Sidebar */}
          <div className="w-full md:w-64 flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <NavItem label="My Profile" active={false} icon="person" />
            <NavItem label="Saved Items" active={true} icon="favorite" />
            <NavItem label="Price Alerts" active={false} icon="notifications_active" />
            <NavItem label="Settings" active={false} icon="settings" />
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-1 text-[#191c1e]">Saved Items</h2>
            <p className="text-[#3d4943] mb-6 text-sm md:text-base">
              Products you're watching for price drops.
            </p>

            <div className="space-y-4">
              <ProductCard
                title="Apple Watch Series 9 GPS 41mm Midnight Aluminum Case"
                platform="Lazada"
              />
              <ProductCard
                title="Sony WH-1000XM5 Wireless Noise Canceling Headphones"
                platform="Shopee"
              />
              <ProductCard
                title="PlayStation 5 Console (Disc Edition) with DualSense Controller"
                platform="Amazon"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavItem({ label, active, icon }) {
  return (
    <div
      className={`px-4 py-3 flex-shrink-0 md:flex-shrink rounded-lg font-medium cursor-pointer transition-colors flex items-center gap-3 ${
        active
          ? "bg-[#00694c]/10 text-[#00694c]"
          : "text-[#3d4943] hover:bg-[#f2f4f6]"
      }`}
    >
      <span className="material-icons opacity-70 border border-current rounded-full w-5 h-5 flex items-center justify-center text-[10px]">
        {/* Simple visual placeholder for icons */}
        {icon[0].toUpperCase()}
      </span>
      {label}
    </div>
  );
}

function ProductCard({ title, platform }) {
  return (
    <div className="bg-[#ffffff] p-4 md:p-5 rounded-xl border border-[#outline-variant]/20 hover:border-emerald-300 shadow-sm hover:shadow-md transition-all group flex flex-col sm:flex-row gap-4 sm:gap-6 justify-between sm:items-center">
      <div className="flex items-start gap-4">
        <div className="w-20 h-20 bg-[#f2f4f6] rounded-lg shrink-0 border border-[#outline-variant]/20 flex items-center justify-center">
          <span className="text-[#bccac1] text-xs">Image</span>
        </div>
        <div className="flex flex-col justify-center max-w-sm">
          <h3 className="font-semibold text-base leading-tight text-[#191c1e] group-hover:text-[#00694c] transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="text-sm text-[#3d4943] mt-2 font-medium">
            Platform: <span className="opacity-80">{platform}</span>
          </p>
        </div>
      </div>
      <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
        <button className="flex-1 sm:flex-none px-4 py-2 border border-[#bccac1]/40 rounded-lg text-sm font-medium hover:bg-[#f2f4f6] transition-colors text-[#3d4943]">
          Remove
        </button>
        <button className="flex-1 sm:flex-none px-4 py-2 bg-gradient-to-br from-[#00694c] to-[#008560] text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all">
          View Detail
        </button>
      </div>
    </div>
  );
}
