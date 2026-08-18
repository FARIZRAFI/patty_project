import React, { useEffect, useState } from 'react';
import { Search, Plus, Edit, Trash2, Download, Layers } from 'lucide-react';
import { api } from '../../api/client';
import { Product, Category } from '../../types';
import { AdminAddEditProductModal } from './AdminAddEditProductModal';
import { AdminCategoryModal } from './AdminCategoryModal';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [prodData, catData] = await Promise.all([
        api.get<Product[]>('/products'),
        api.get<Category[]>('/categories')
      ]);
      setProducts(prodData);
      setCategories(catData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await api.delete(`/products/${id}`);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      (selectedCategory === 'ALL' || p.category_id === selectedCategory) &&
      (p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="w-full max-w-[1220px] mx-auto px-6 sm:px-8 py-8 space-y-6 text-[#F5F5F5]">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#F5F5F5] tracking-tight">Products</h1>
          <p className="text-sm text-[#A1A1AA] font-normal mt-1">Manage and view all products</p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowCategoryModal(true)}
            className="h-10 px-4 bg-[#151515] border border-[#242424] hover:border-[#333333] text-[#F5F5F5] hover:bg-[#1C1C1C] rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Layers className="w-4 h-4 text-[#FF5A00]" />
            <span>Manage Categories</span>
          </button>
          <button
            onClick={() => {
              setEditingProduct(null);
              setShowAddModal(true);
            }}
            className="h-10 px-4 bg-[#FF5A00] hover:bg-[#E84F00] text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0D0D0D] border border-[#242424] p-3 rounded-lg">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative w-64 sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-[#71717A]" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 bg-[#151515] border border-[#242424] focus:border-[#FF5A00] rounded-lg py-2 pl-9 pr-3.5 text-xs text-[#F5F5F5] placeholder-[#71717A] focus:outline-none transition-colors"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-10 bg-[#151515] border border-[#242424] focus:border-[#FF5A00] text-[#F5F5F5] text-xs font-medium px-3.5 rounded-lg focus:outline-none cursor-pointer transition-colors"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2.5">
          <button className="h-10 px-4 bg-[#151515] border border-[#242424] hover:border-[#333333] text-[#A1A1AA] hover:text-[#F5F5F5] rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer">
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Products Data Table */}
      <div className="bg-[#0D0D0D] border border-[#242424] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#171717] text-[#A1A1AA] uppercase text-[11px] font-semibold border-b border-[#1C1C1C]">
              <tr>
                <th className="px-5 py-3.5">Product ID</th>
                <th className="px-5 py-3.5">Product</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5 text-right">Price</th>
                <th className="px-5 py-3.5 text-right">Stock</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C1C1C] bg-[#0D0D0D]">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-5 py-4"><div className="h-4 bg-[#151515] rounded w-20" /></td>
                    <td className="px-5 py-4"><div className="h-4 bg-[#151515] rounded w-36" /></td>
                    <td className="px-5 py-4"><div className="h-4 bg-[#151515] rounded w-24" /></td>
                    <td className="px-5 py-4 text-right"><div className="h-4 bg-[#151515] rounded w-16 ml-auto" /></td>
                    <td className="px-5 py-4 text-right"><div className="h-4 bg-[#151515] rounded w-12 ml-auto" /></td>
                    <td className="px-5 py-4 text-center"><div className="h-4 bg-[#151515] rounded w-16 mx-auto" /></td>
                    <td className="px-5 py-4 text-right"><div className="h-4 bg-[#151515] rounded w-16 ml-auto" /></td>
                  </tr>
                ))
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-[#71717A]">
                    No products found. Click "Add Product" to create your first menu item.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-[#121212] transition-colors h-14">
                    <td className="px-5 py-3 font-semibold text-[#FF5A00]">#{p.sku}</td>
                    <td className="px-5 py-3 flex items-center gap-3">
                      <img
                        src={p.image_url || '/placeholder-burger.svg'}
                        alt={p.name}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/placeholder-burger.svg';
                        }}
                        className="w-10 h-10 rounded-lg object-cover border border-[#242424] bg-[#151515] shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-[#F5F5F5] text-xs truncate">{p.name}</p>
                          {p.is_bestseller && (
                            <span className="text-[9px] bg-[#241209] text-[#FF7A33] border border-[#6B2A0D] px-1.5 py-0.2 rounded font-semibold uppercase tracking-wider shrink-0">
                              BEST SELLER
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#71717A] truncate">SKU: {p.sku}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-[#A1A1AA] font-normal">
                      {categories.find((c) => c.id === p.category_id)?.name || 'Burgers'}
                    </td>
                    <td className="px-5 py-3 text-right font-semibold text-[#F5F5F5]">£{p.base_price.toFixed(2)}</td>
                    <td className="px-5 py-3 text-right font-semibold text-[#F5F5F5]">100</td>
                    <td className="px-5 py-3 text-center">
                      <span className="px-2.5 py-0.5 bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30 rounded text-[10px] font-semibold uppercase tracking-wider">
                        Active
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setEditingProduct(p);
                            setShowAddModal(true);
                          }}
                          className="w-8 h-8 rounded-lg bg-[#151515] border border-[#242424] text-[#A1A1AA] hover:text-[#F5F5F5] hover:border-[#333333] inline-flex items-center justify-center transition-colors cursor-pointer"
                          title="Edit Product"
                          aria-label="Edit product"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="w-8 h-8 rounded-lg bg-[#151515] border border-[#242424] text-[#71717A] hover:text-[#EF4444] hover:border-[#EF4444]/40 hover:bg-[#EF4444]/10 inline-flex items-center justify-center transition-colors cursor-pointer"
                          title="Delete Product"
                          aria-label="Delete product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <AdminAddEditProductModal
          categories={categories}
          product={editingProduct}
          onClose={() => {
            setShowAddModal(false);
            setEditingProduct(null);
          }}
          onSuccess={() => {
            fetchData();
            setShowAddModal(false);
            setEditingProduct(null);
          }}
        />
      )}
      {showCategoryModal && (
        <AdminCategoryModal
          categories={categories}
          onClose={() => setShowCategoryModal(false)}
          onRefresh={fetchData}
        />
      )}
    </div>
  );
};
