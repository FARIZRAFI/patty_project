import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Category } from '../../types';
import { api } from '../../api/client';

interface Props {
  categories: Category[];
  onClose: () => void;
  onRefresh: () => void;
}

export const AdminCategoryModal: React.FC<Props> = ({ categories, onClose, onRefresh }) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setLoading(true);
    setError(null);
    try {
      await api.post('/categories', { name: newCategoryName.trim() });
      setNewCategoryName('');
      onRefresh();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to create category.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the category "${name}"?`)) {
      try {
        await api.delete(`/categories/${id}`);
        onRefresh();
      } catch (err: any) {
        console.error(err);
        setError(err?.message || 'Failed to delete category.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121212] border border-[#262626] rounded-2xl w-full max-w-md shadow-2xl p-6 relative">
        <div className="flex items-center justify-between pb-4 border-b border-[#262626] mb-6">
          <div>
            <h2 className="text-lg font-bold text-white">Manage Categories</h2>
            <p className="text-xs text-[#9CA3AF]">Create and remove menu categories</p>
          </div>
          <button onClick={onClose} className="p-2 text-[#9CA3AF] hover:text-white rounded-xl hover:bg-[#1A1A1A]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-[#2A1215] border border-[#EF4444]/40 text-[#FCA5A5] rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Create Category Form */}
        <form onSubmit={handleCreateCategory} className="mb-6 space-y-3">
          <label className="block text-xs font-semibold text-[#D1D5DB]">Add New Category</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="e.g. Desserts, Milkshakes"
              className="flex-1 bg-[#1A1A1A] border border-[#262626] rounded-xl py-2 px-3 text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#FF5500]"
              required
            />
            <button
              type="submit"
              disabled={loading || !newCategoryName.trim()}
              className="bg-[#FF5500] hover:bg-[#E04B00] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
        </form>

        {/* Existing Categories List */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-[#9CA3AF] uppercase mb-2">Existing Categories ({categories.length})</h3>
          <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
            {categories.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between bg-[#1A1A1A] border border-[#262626] p-3 rounded-xl hover:border-[#333333] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold text-white">{c.name}</span>
                  <span className="text-[10px] text-[#6B7280] bg-[#121212] px-2 py-0.5 rounded font-mono">/{c.slug}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteCategory(c.id, c.name)}
                  className="p-1.5 text-[#9CA3AF] hover:text-[#EF4444] hover:bg-[#2A1215] rounded-lg transition-colors cursor-pointer"
                  title="Delete Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-5 mt-6 border-t border-[#262626] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#262626] text-white rounded-xl text-xs font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
