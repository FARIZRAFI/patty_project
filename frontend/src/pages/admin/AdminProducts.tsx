import React, { useEffect, useState } from 'react';
import { Search, Plus, Edit, Trash2, Download, Layers, CheckCircle2, XCircle } from 'lucide-react';
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
    <div className="w-full max-w-[1220px] mx-auto px-6 sm:px-8 py-8 space-y-6 text-[#F5F5F5]">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#F5F5F5] tracking-tight">Products & Stock</h1>
          <p className="text-sm text-[#A1A1AA] font-normal mt-1">
            {user?.role === 'BRANCH_ADMIN'
              ? 'Manage stock quantities and out-of-stock items for your assigned branch.'
              : 'Manage and view all products, categories, and branch inventory.'}
          </p>
        </div>

        {user?.role === 'SUPER_ADMIN' && (
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
        )}
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

          {/* Branch Stock Selector */}
          <select
            value={selectedBranchId}
            onChange={(e) => setSelectedBranchId(e.target.value)}
            disabled={user?.role === 'BRANCH_ADMIN'}
            className="h-10 bg-[#151515] border border-[#242424] focus:border-[#FF5A00] text-[#F5F5F5] text-xs font-medium px-3.5 rounded-lg focus:outline-none cursor-pointer transition-colors disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {branches.map((b) => (
              <option key={b.id} value={b.id}>Stock: {b.name}</option>
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
                <th className="px-5 py-3.5 text-right">Branch Stock</th>
                <th className="px-5 py-3.5 text-center">Availability</th>
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
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const inv = inventoryMap[p.id];
                  const stockQty = inv?.stock_quantity ?? 100;
                  const isAvailable = inv ? inv.is_available : true;

                  return (
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
                      <td className="px-5 py-3 text-right font-semibold">
                        <button
                          onClick={() => handleUpdateStockQuantity(p.id, stockQty)}
                          title="Click to update stock quantity"
                          className="text-[#F5F5F5] hover:text-[#FF5A00] transition-colors cursor-pointer underline decoration-dotted"
                        >
                          {stockQty}
                        </button>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <button
                          onClick={() => handleToggleStock(p.id)}
                          title={isAvailable ? 'Click to mark Out of Stock' : 'Click to mark In Stock'}
                          className={`px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1 mx-auto ${
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
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {user?.role === 'SUPER_ADMIN' ? (
                            <>
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
                            </>
                          ) : (
                            <button
                              onClick={() => handleUpdateStockQuantity(p.id, stockQty)}
                              className="px-2.5 py-1 rounded bg-[#151515] border border-[#242424] text-[#A1A1AA] hover:text-[#F5F5F5] hover:border-[#FF5A00] text-[11px] font-medium transition-colors cursor-pointer"
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

