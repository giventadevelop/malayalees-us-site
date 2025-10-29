import { getAppUrl } from '@/lib/env';
import { redirect } from 'next/navigation';

async function fetchGroup(baseUrl: string, id: string) {
  try {
    const res = await fetch(`${baseUrl}/api/proxy/focus-groups/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

export default async function EditFocusGroupPage({ params }: { params: { id: string } }) {
  const baseUrl = getAppUrl();
  const group = await fetchGroup(baseUrl, params.id);
  async function updateFocusGroup(formData: FormData) {
    'use server';
    const payload = {
      id: Number(params.id),
      name: formData.get('name')?.toString().trim() || undefined,
      slug: formData.get('slug')?.toString().trim() || undefined,
      description: formData.get('description')?.toString() || undefined,
      coverImageUrl: formData.get('coverImageUrl')?.toString() || undefined,
      isActive: formData.getAll('isActive').some(v => String(v).toLowerCase() === 'true' || String(v).toLowerCase() === 'on'),
      updatedAt: new Date().toISOString(),
    } as any;
    await fetch(`${baseUrl}/api/proxy/focus-groups/${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/merge-patch+json' },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });
    redirect('/admin/focus-groups');
  }

  return (
    <div className="px-8 pt-24 pb-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-2">Edit Focus Group</h1>
      <form action={updateFocusGroup} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input name="name" defaultValue={group?.name} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
          <input name="slug" defaultValue={group?.slug} pattern="[a-z0-9-]+" title="lowercase letters, numbers, hyphens only" className="w-full border rounded px-3 py-2" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea name="description" rows={4} defaultValue={group?.description} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
          <input name="coverImageUrl" defaultValue={group?.coverImageUrl} className="w-full border rounded px-3 py-2" />
        </div>
        <div className="flex items-center gap-2">
          <input type="hidden" name="isActive" value="false" />
          <input type="checkbox" name="isActive" value="true" defaultChecked={!!group?.isActive} className="h-4 w-4" />
          <span className="text-sm">Active</span>
        </div>
        <div className="md:col-span-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
        </div>
      </form>
    </div>
  );
}


