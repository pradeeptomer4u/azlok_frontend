'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { hasModuleAccess } from '../../../types/permissions';
import seoService, { SeoSettings, SeoPageType } from '../../../services/seoService';
import blogService from '../../../services/blogService';
import productService from '../../../services/productService';
import categoryService from '../../../services/categoryService';

const TABS: { key: SeoPageType; label: string }[] = [
  { key: 'homepage', label: 'Homepage' },
  { key: 'product', label: 'Products' },
  { key: 'category', label: 'Categories' },
  { key: 'blog', label: 'Blogs' },
];

const ROBOTS_OPTIONS = [
  'index, follow',
  'noindex, follow',
  'index, nofollow',
  'noindex, nofollow',
];

const emptyForm = (): SeoSettings => ({
  page_type: 'homepage',
  identifier: '',
  title: '',
  description: '',
  keywords: '',
  og_title: '',
  og_description: '',
  og_image: '',
  canonical_url: '',
  robots: 'index, follow',
});

interface SelectOption { value: string; label: string }

export default function AdminSeoPage() {
  const router = useRouter();
  const { permissions, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<SeoPageType>('homepage');
  const [form, setForm] = useState<SeoSettings>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Dropdown options for product / category / blog tabs
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [selectedIdentifier, setSelectedIdentifier] = useState('');

  // Load dropdown options when tab changes
  useEffect(() => {
    setForm({ ...emptyForm(), page_type: activeTab });
    setSelectedIdentifier('');
    setSuccess(null);
    setError(null);

    if (activeTab === 'homepage') {
      setOptions([]);
      loadSeo('homepage', undefined);
      return;
    }

    const fetchOptions = async () => {
      try {
        if (activeTab === 'product') {
          const res = await productService.getProducts({}, 1, 200);
          setOptions((res.items || []).map((p) => ({ value: p.slug || String(p.id), label: p.name })));
        } else if (activeTab === 'category') {
          const cats = await categoryService.getAllCategories();
          setOptions(cats.map((c) => ({ value: c.slug || String(c.id), label: c.name })));
        } else if (activeTab === 'blog') {
          const res = await blogService.getBlogs(1, 200);
          setOptions((res.blogs || []).map((b) => ({ value: b.slug, label: b.title })));
        }
      } catch {
        setOptions([]);
      }
    };

    fetchOptions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // Load SEO when identifier changes (for non-homepage tabs)
  useEffect(() => {
    if (activeTab !== 'homepage' && selectedIdentifier) {
      loadSeo(activeTab, selectedIdentifier);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIdentifier]);

  const loadSeo = useCallback(async (page_type: SeoPageType, identifier?: string) => {
    setLoading(true);
    setError(null);
    try {
      const existing = await seoService.get(page_type, identifier);
      if (existing) {
        setForm({ ...emptyForm(), ...existing });
      } else {
        setForm({ ...emptyForm(), page_type, identifier: identifier || '' });
      }
    } catch {
      setForm({ ...emptyForm(), page_type, identifier: identifier || '' });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (field: keyof SeoSettings, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (activeTab !== 'homepage' && !selectedIdentifier) {
      setError('Please select a specific page item first.');
      return;
    }

    setSaving(true);
    setSuccess(null);
    setError(null);
    try {
      const payload: SeoSettings = {
        ...form,
        page_type: activeTab,
        identifier: activeTab === 'homepage' ? undefined : selectedIdentifier,
      };
      await seoService.save(payload);
      setSuccess('SEO settings saved successfully!');
    } catch {
      setError('Failed to save SEO settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const charCount = (val: string, max: number) => (
    <span className={`text-xs ml-1 ${val.length > max ? 'text-red-500' : 'text-gray-400'}`}>
      {val.length}/{max}
    </span>
  );

  // Permission gate — only super_admin or users with 'seo' module access
  const canAccess = !authLoading && permissions &&
    (permissions.is_super_admin || hasModuleAccess(permissions, 'seo'));

  if (!authLoading && !canAccess) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <h2 className="text-lg font-semibold text-gray-700 mb-1">Access Denied</h2>
        <p className="text-sm text-gray-500 mb-4">You don&apos;t have permission to manage SEO settings.</p>
        <button onClick={() => router.push('/admin')} className="text-sm text-blue-600 hover:underline">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">SEO Management</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage meta titles, descriptions, keywords, and Open Graph tags for each page.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 gap-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2.5 text-sm font-medium rounded-t-md transition-colors ${
              activeTab === tab.key
                ? 'bg-white border border-b-white border-gray-200 text-blue-600 -mb-px'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 max-w-3xl">
        {/* Identifier selector (for non-homepage) */}
        {activeTab !== 'homepage' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select {activeTab === 'product' ? 'Product' : activeTab === 'category' ? 'Category' : 'Blog Post'}
            </label>
            <select
              value={selectedIdentifier}
              onChange={(e) => setSelectedIdentifier(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select one --</option>
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
          </div>
        ) : (
          <>
            {/* Basic SEO */}
            <section className="mb-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Basic SEO</h2>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-1">
                    Page Title {charCount(form.title || '', 60)}
                  </label>
                  <input
                    type="text"
                    value={form.title || ''}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="e.g. Azlok - Best Natural Products in India"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">Recommended: up to 60 characters</p>
                </div>

                <div>
                  <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-1">
                    Meta Description {charCount(form.description || '', 160)}
                  </label>
                  <textarea
                    value={form.description || ''}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Brief description of the page for search engine results…"
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">Recommended: up to 160 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
                  <input
                    type="text"
                    value={form.keywords || ''}
                    onChange={(e) => handleChange('keywords', e.target.value)}
                    placeholder="natural products, organic spices, farm to consumer"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">Comma-separated keywords</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Canonical URL</label>
                    <input
                      type="text"
                      value={form.canonical_url || ''}
                      onChange={(e) => handleChange('canonical_url', e.target.value)}
                      placeholder="/products/turmeric-powder"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Robots</label>
                    <select
                      value={form.robots || 'index, follow'}
                      onChange={(e) => handleChange('robots', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {ROBOTS_OPTIONS.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </section>

            {/* Open Graph */}
            <section className="mb-6 pt-6 border-t border-gray-100">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                Open Graph (Social Sharing)
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-1">
                    OG Title {charCount(form.og_title || '', 60)}
                  </label>
                  <input
                    type="text"
                    value={form.og_title || ''}
                    onChange={(e) => handleChange('og_title', e.target.value)}
                    placeholder="Leave blank to use Page Title"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-1">
                    OG Description {charCount(form.og_description || '', 200)}
                  </label>
                  <textarea
                    value={form.og_description || ''}
                    onChange={(e) => handleChange('og_description', e.target.value)}
                    placeholder="Leave blank to use Meta Description"
                    rows={2}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">OG Image URL</label>
                  <input
                    type="text"
                    value={form.og_image || ''}
                    onChange={(e) => handleChange('og_image', e.target.value)}
                    placeholder="/images/og-homepage.jpg or https://..."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">Recommended: 1200×630 px</p>
                  {form.og_image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={form.og_image}
                      alt="OG preview"
                      className="mt-2 rounded border border-gray-200 max-h-32 object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  )}
                </div>
              </div>
            </section>

            {/* Feedback */}
            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">
                {success}
              </div>
            )}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSave}
                disabled={saving || (activeTab !== 'homepage' && !selectedIdentifier)}
                className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? 'Saving…' : 'Save SEO Settings'}
              </button>
              <button
                onClick={() => {
                  setForm({ ...emptyForm(), page_type: activeTab, identifier: selectedIdentifier });
                  setSuccess(null);
                  setError(null);
                }}
                className="px-5 py-2 border border-gray-300 text-gray-600 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}