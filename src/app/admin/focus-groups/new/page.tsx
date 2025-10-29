import { getAppUrl } from '@/lib/env';
import { redirect } from 'next/navigation';

async function createFocusGroup(formData: FormData) {
  'use server';
  const baseUrl = getAppUrl();
  const isActiveRaw = formData.getAll('isActive');
  const isActive = isActiveRaw.some(v => String(v).toLowerCase() === 'true' || String(v).toLowerCase() === 'on');
  const payload = {
    name: formData.get('name')?.toString().trim() || '',
    slug: formData.get('slug')?.toString().trim() || '',
    description: formData.get('description')?.toString() || '',
    coverImageUrl: formData.get('coverImageUrl')?.toString() || '',
    isActive,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as any;
  await fetch(`${baseUrl}/api/proxy/focus-groups`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });
  redirect('/admin/focus-groups');
}

export default function NewFocusGroupPage() {
  return (
    <div className="px-8 pt-24 pb-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-2">Create Focus Group</h1>
      <p className="text-sm text-gray-600 mb-6">Slug must be URL-safe; active groups appear publicly.</p>
      <form action={createFocusGroup} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input name="name" required className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
          <input name="slug" required pattern="[a-z0-9-]+" title="lowercase letters, numbers, hyphens only" className="w-full border rounded px-3 py-2" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea name="description" rows={4} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
          <input name="coverImageUrl" className="w-full border rounded px-3 py-2" />
        </div>
        <div className="flex items-center gap-2">
          <input type="hidden" name="isActive" value="false" />
          <input type="checkbox" name="isActive" value="true" defaultChecked className="h-4 w-4" />
          <span className="text-sm">Active</span>
        </div>
        <div className="md:col-span-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded">Create</button>
        </div>
      </form>
    </div>
  );
}


