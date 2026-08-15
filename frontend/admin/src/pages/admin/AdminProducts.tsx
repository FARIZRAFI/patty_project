import React, { useEffect, useState } from 'react';
import { Search, Plus, Edit, Trash2, Calendar, Download } from 'lucide-react';
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
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Products</h1>
          <p className="text-[#9CA3AF] text-sm mt-0.5">Manage and view all products</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCategoryModal(true)}
            className="bg-[#1A1A1A] hover:bg-[#262626] border border-[#262626] text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#FF5500]" />
            <span>Manage Categories</span>
          </button>
          <button
            onClick={() => {
              setEditingProduct(null);
              setShowAddModal(true);
            }}
            className="bg-[#FF5500] hover:bg-[#E04B00] text-white px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-[#FF5500]/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#121212] border border-[#262626] p-4 rounded-2xl">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-[#262626] rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#FF5500]"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#1A1A1A] border border-[#262626] text-white text-xs font-medium px-4 py-2 rounded-xl focus:outline-none focus:border-[#FF5500]"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button className="bg-[#1A1A1A] border border-[#262626] text-[#9CA3AF] hover:text-white px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Products Table (Matching Page 5 of Admin PDF) */}
      <div className="bg-[#121212] border border-[#262626] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1A1A1A] text-[#9CA3AF] uppercase font-semibold border-b border-[#262626]">
              <tr>
                <th className="px-5 py-3.5">Product ID</th>
                <th className="px-5 py-3.5">Product</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Price</th>
                <th className="px-5 py-3.5">Stock</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F1F1F]">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-[#1A1A1A] transition-colors">
                  <td className="px-5 py-4 font-bold text-[#FF5500]">#{p.sku}</td>
                  <td className="px-5 py-4 flex items-center gap-3">
                    <img
                      src={p.image_url || '/placeholder-burger.svg'}
                      alt={p.name}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/placeholder-burger.svg';
                      }}
                      className="w-10 h-10 rounded-xl object-cover border border-[#262626]"
                    />
                    <div>
                      <p className="font-bold text-white flex items-center gap-2">
                        <span>{p.name}</span>
                        {p.is_bestseller && (
                          <span className="text-[9px] bg-[#FF5500]/20 text-[#FF5500] border border-[#FF5500]/40 px-1.5 py-0.5 rounded font-bold">BEST SELLER</span>
                        )}
                      </p>
                      <p className="text-[10px] text-[#6B7280]">SKU: {p.sku}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[#9CA3AF]">
                    {categories.find((c) => c.id === p.category_id)?.name || 'Burgers'}
                  </td>
                  <td className="px-5 py-4 font-bold text-white">£{p.base_price.toFixed(2)}</td>
                  <td className="px-5 py-4 font-semibold text-white">100</td>
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-1 bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30 rounded-full text-[10px] font-bold">
                      Active
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right space-x-2">
                    <button
                      onClick={() => {
                        setEditingProduct(p);
                        setShowAddModal(true);
                      }}
                      className="p-1.5 bg-[#1A1A1A] hover:bg-[#262626] rounded-lg text-[#9CA3AF] hover:text-white transition-colors cursor-pointer"
                      title="Edit Product"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p.id, p.name)}
                      className="p-1.5 bg-[#1A1A1A] hover:bg-[#2A1215] border border-[#262626] hover:border-[#EF4444]/40 rounded-lg text-[#9CA3AF] hover:text-[#EF4444] transition-colors cursor-pointer"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
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
