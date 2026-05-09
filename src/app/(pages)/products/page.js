// src/app/(pages)/products/page.js
import { getProducts } from '@/lib/services/productService';

export default async function ProductsPage() {
  // Fetch the data directly from Supabase (Server Component magic!)
  const products = await getProducts();

  return (
    <main className="p-8 max-w-7xl mx-auto min-h-screen">
      <h1 className="text-3xl font-extrabold mb-8 text-slate-800">Compare Keyboards</h1>
      
      {/* Grid Layout for the items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div 
            key={product.id} 
            className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow"
          >
            {/* Product Image */}
            <div className="aspect-square w-full mb-4 overflow-hidden rounded-xl bg-slate-50">
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Details */}
            <div className="flex flex-col flex-grow">
              <h2 className="text-sm font-semibold line-clamp-2 text-slate-700 mb-2">
                {product.name}
              </h2>
              
              <div className="mt-auto">
                <div className="flex justify-between items-end mb-3">
                  <span className="text-xl font-bold text-emerald-600">
                    ₱{product.price.toFixed(2)}
                  </span>
                  <span className="text-xs font-medium px-2 py-1 bg-slate-100 rounded-md text-slate-500">
                    {product.platform}
                  </span>
                </div>

                {/* Link out to the actual store */}
                <a 
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-slate-900 text-white text-sm font-medium py-2 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  View on {product.platform}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Fallback if database is empty */}
      {products.length === 0 && (
        <p className="text-center text-slate-500 mt-10">No products found. Did you insert the mock data?</p>
      )}
    </main>
  );
}