import React, { useEffect, useState } from 'react';
import { Search, Plus, Edit, Trash2, Download, CheckCircle2, XCircle, Layers } from 'lucide-react';
import { api } from '../../api/client';
import { Product, Category, Branch } from '../../types';
import { useAuthStore } from '../../store/authStore';
import { AdminAddEditProductModal } from './AdminAddEditProductModal';
import { AdminCategoryModal } from './AdminCategoryModal';

interface InventoryItem {
  id: string;
  branch_id: string;
  product_id: string;
  stock_quantity: number;
  low_stock_threshold: number;
  is_available: boolean;
}

export const AdminProducts: React.FC = () => {
  const { user } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string>(
    user?.role === 'BRANCH_ADMIN' && user.branch_ids && user.branch_ids[0] ? user.branch_ids[0] : ''
  );
  const [inventoryMap, setInventoryMap] = useState<Record<string, InventoryItem>>({});
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedBranchId) {
      fetchInventory(selectedBranchId);
    }
  }, [selectedBranchId]);

  const fetchInitialData = async () => {
    try {
      const [prodData, catData, branchData] = await Promise.all([
        api.get<Product[]>('/products'),
        api.get<Category[]>('/categories'),
        api.get<Branch[]>('/branches')
      ]);
      setProducts(prodData || []);
      setCategories(catData || []);

      let filteredBranches = branchData || [];
      if (user?.role === 'BRANCH_ADMIN' && user.branch_ids && user.branch_ids.length > 0) {
        filteredBranches = filteredBranches.filter((b) => user.branch_ids.includes(b.id));
      }
      setBranches(filteredBranches);

      const defaultBranch = user?.role === 'BRANCH_ADMIN' && user.branch_ids && user.branch_ids[0]
        ? user.branch_ids[0]
        : (filteredBranches[0]?.id || '');
      setSelectedBranchId(defaultBranch);
      if (defaultBranch) {
        fetchInventory(defaultBranch);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInventory = async (branchId: string) => {
    try {
      const invData = await api.get<InventoryItem[]>(`/inventory?branch_id=${branchId}`);
      const map: Record<string, InventoryItem> = {};
      (invData || []).forEach((item) => {
        map[item.product_id] = item;
      });
      setInventoryMap(map);
    } catch (err) {
      console.error('Failed to fetch inventory:', err);
    }
  };

  const handleToggleStock = async (productId: string) => {
    if (!selectedBranchId) return;
    const currentInv = inventoryMap[productId];
    const currentStatus = currentInv ? currentInv.is_available : true;
    const newStatus = !currentStatus;

    try {
      const updated = await api.post<InventoryItem>('/inventory/toggle', {
        branch_id: selectedBranchId,
        product_id: productId,
        is_available: newStatus
      });
      setInventoryMap((prev) => ({
        ...prev,
        [productId]: updated
      }));
    } catch (err) {
      console.error('Failed to toggle stock availability:', err);
      alert('Failed to update stock status. Please try again.');
    }
  };

  const handleUpdateStockQuantity = async (productId: string, currentStock: number) => {
    if (!selectedBranchId) return;
    const newQtyStr = window.prompt(`Enter new stock quantity for this branch:`, String(currentStock));
    if (newQtyStr === null) return;
    const newQty = parseInt(newQtyStr, 10);
    if (isNaN(newQty) || newQty < 0) {
      alert('Please enter a valid non-negative number.');
      return;
    }

    try {
      const updated = await api.post<InventoryItem>('/inventory/toggle', {
        branch_id: selectedBranchId,
        product_id: productId,
        stock_quantity: newQty
      });
      setInventoryMap((prev) => ({
        ...prev,
        [productId]: updated
      }));
    } catch (err) {
      console.error('Failed to update stock quantity:', err);
      alert('Failed to update stock quantity. Please try again.');
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (user?.role !== 'SUPER_ADMIN') return;
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await api.delete(`/products/${id}`);
        fetchInitialData();
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
          <h1 className="text-2xl font-bold text-white tracking-wide">Products & Stock</h1>
          <p className="text-[#9CA3AF] text-sm mt-0.5">
            {user?.role === 'BRANCH_ADMIN'
              ? 'Manage stock quantities and out-of-stock items for your assigned branch.'
              : 'Manage and view all products, categories, and branch inventory.'}
          </p>
        </div>

        {user?.role === 'SUPER_ADMIN' && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCategoryModal(true)}
              className="bg-[#1A1A1A] hover:bg-[#262626] border border-[#262626] text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
            >
              <Layers className="w-4 h-4 text-[#FF5500]" />
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
        )}
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
            className="bg-[#1A1A1A] border border-[#262626] rounded-xl py-2 px-4 text-xs text-white focus:outline-none focus:border-[#FF5500]"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* Branch Stock Selector */}
          <select
            value={selectedBranchId}
            onChange={(e) => setSelectedBranchId(e.target.value)}
            disabled={user?.role === 'BRANCH_ADMIN'}
            className="bg-[#1A1A1A] border border-[#262626] rounded-xl py-2 px-4 text-xs text-white focus:outline-none focus:border-[#FF5500] disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {branches.map((b) => (
              <option key={b.id} value={b.id}>Stock: {b.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button className="bg-[#1A1A1A] hover:bg-[#262626] border border-[#262626] text-[#9CA3AF] px-4 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2 transition-all">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Products Data Table */}
      <div className="bg-[#121212] border border-[#262626] rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#1A1A1A] text-[#9CA3AF] uppercase text-[10px] font-semibold tracking-wider border-b border-[#262626]">
            <tr>
              <th className="px-6 py-4">Product ID</th>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4 text-right">Price</th>
              <th className="px-6 py-4 text-right">Branch Stock</th>
              <th className="px-6 py-4 text-center">Availability</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#262626]">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-[#9CA3AF]">
                  Loading products...
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-[#9CA3AF]">
                  No products found.
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => {
                const inv = inventoryMap[p.id];
                const stockQty = inv?.stock_quantity ?? 100;
                const isAvailable = inv ? inv.is_available : true;

                return (
                  <tr key={p.id} className="hover:bg-[#1A1A1A]/40 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-[#FF5500]">#{p.sku}</td>
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img
                        src={p.image_url || '/placeholder-burger.svg'}
                        alt={p.name}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/placeholder-burger.svg';
                        }}
                        className="w-10 h-10 rounded-lg object-cover bg-[#1A1A1A] border border-[#262626] shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-white text-xs truncate">{p.name}</p>
                          {p.is_bestseller && (
                            <span className="text-[9px] bg-[#FF5500]/10 text-[#FF5500] border border-[#FF5500]/20 px-1.5 py-0.5 rounded font-semibold uppercase">
                              Best Seller
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#9CA3AF] truncate">{p.short_description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#9CA3AF]">
                      {categories.find((c) => c.id === p.category_id)?.name || 'Burgers'}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-white">£{p.base_price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right font-semibold">
                      <button
                        onClick={() => handleUpdateStockQuantity(p.id, stockQty)}
                        title="Click to update stock quantity"
                        className="text-white hover:text-[#FF5500] transition-colors cursor-pointer underline decoration-dotted"
                      >
                        {stockQty}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleStock(p.id)}
                        title={isAvailable ? 'Click to mark Out of Stock' : 'Click to mark In Stock'}
                        className={`px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider transition-colors cursor-pointer inline-flex items-center gap-1 ${
                          isAvailable
                            ? 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30 hover:bg-[#22C55E]/20'
                            : 'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30 hover:bg-[#EF4444]/20'
                        }`}
                      >
                        {isAvailable ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>In Stock</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            <span>Out of Stock</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {user?.role === 'SUPER_ADMIN' ? (
                          <>
                            <button
                              onClick={() => {
                                setEditingProduct(p);
                                setShowAddModal(true);
                              }}
                              className="p-2 text-[#9CA3AF] hover:text-white hover:bg-[#1A1A1A] rounded-xl transition-all cursor-pointer"
                              title="Edit Product"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              className="p-2 text-[#9CA3AF] hover:text-[#EF4444] hover:bg-[#EF4444]/10 rounded-xl transition-all cursor-pointer"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleUpdateStockQuantity(p.id, stockQty)}
                            className="px-2.5 py-1 rounded bg-[#1A1A1A] border border-[#262626] text-[#9CA3AF] hover:text-white hover:border-[#FF5500] text-[11px] font-medium transition-colors cursor-pointer"
                          >
                            Edit Stock
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {showAddModal && user?.role === 'SUPER_ADMIN' && (
        <AdminAddEditProductModal
          categories={categories}
          product={editingProduct}
          onClose={() => {
            setShowAddModal(false);
            setEditingProduct(null);
          }}
          onSuccess={() => {
            fetchInitialData();
            setShowAddModal(false);
            setEditingProduct(null);
          }}
        />
      )}
      {showCategoryModal && user?.role === 'SUPER_ADMIN' && (
        <AdminCategoryModal
          categories={categories}
          onClose={() => setShowCategoryModal(false)}
          onRefresh={fetchInitialData}
        />
      )}
    </div>
  );
};
