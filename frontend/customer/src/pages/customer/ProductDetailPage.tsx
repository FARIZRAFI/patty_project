import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import { Product } from '../../types';
import { ProductDetailModal } from './ProductDetailModal';

export const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    }
  }, [productId]);

  const fetchProduct = async (id: string) => {
    try {
      const data = await api.get<Product>(`/products/${id}`);
      setProduct(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-[#9CA3AF]">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-[#9CA3AF]">
        <p>Product not found.</p>
        <button
          onClick={() => navigate('/menu')}
          className="px-5 py-2.5 bg-[#FF5500] text-white rounded-xl font-bold text-xs"
        >
          Back to Menu
        </button>
      </div>
    );
  }

  return (
    <ProductDetailModal
      product={product}
      onClose={() => navigate('/menu')}
    />
  );
};
