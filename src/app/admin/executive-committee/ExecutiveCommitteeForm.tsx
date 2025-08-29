'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FaUpload, FaTimes, FaSpinner, FaPlus, FaTrash } from 'react-icons/fa';
import type { ExecutiveCommitteeTeamMemberDTO, ExecutiveCommitteeTeamMemberFormData } from '@/types/executiveCommitteeTeamMember';
import { createExecutiveCommitteeMember, updateExecutiveCommitteeMember } from './ApiServerActions';

interface ExecutiveCommitteeFormProps {
  member?: ExecutiveCommitteeTeamMemberDTO | null;
  onSuccess: (member: ExecutiveCommitteeTeamMemberDTO) => void;
  onCancel: () => void;
}

export default function ExecutiveCommitteeForm({
  member,
  onSuccess,
  onCancel,
}: ExecutiveCommitteeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(member?.profileImageUrl || null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [expertiseItems, setExpertiseItems] = useState<string[]>(['']);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ExecutiveCommitteeTeamMemberFormData>({
    defaultValues: {
      firstName: member?.firstName || '',
      lastName: member?.lastName || '',
      title: member?.title || '',
      designation: member?.designation || '',
      bio: member?.bio || '',
      email: member?.email || '',
      expertise: [''],
      imageBackground: member?.imageBackground || '',
      imageStyle: member?.imageStyle || '',
      department: member?.department || '',
      joinDate: member?.joinDate ? member.joinDate.split('T')[0] : '',
      isActive: member?.isActive ?? true,
      linkedinUrl: member?.linkedinUrl || '',
      twitterUrl: member?.twitterUrl || '',
      priorityOrder: member?.priorityOrder || 0,
      websiteUrl: member?.websiteUrl || '',
    },
  });

  const watchedIsActive = watch('isActive');

  useEffect(() => {
    if (member) {
      setValue('firstName', member.firstName);
      setValue('lastName', member.lastName);
      setValue('title', member.title);
      setValue('designation', member.designation || '');
      setValue('bio', member.bio || '');
      setValue('email', member.email || '');
      // Handle expertise field - convert from JSON array or space-separated string to array
      let expertiseArray: string[] = [''];
      if (member.expertise) {
        if (Array.isArray(member.expertise)) {
          expertiseArray = member.expertise.length > 0 ? member.expertise : [''];
        } else if (typeof member.expertise === 'string' && member.expertise.startsWith('[')) {
          try {
            const parsed = JSON.parse(member.expertise);
            expertiseArray = Array.isArray(parsed) && parsed.length > 0 ? parsed : [''];
          } catch {
            expertiseArray = member.expertise.trim() ? [member.expertise] : [''];
          }
        } else if (member.expertise.trim()) {
          expertiseArray = member.expertise.split(/\s+/).filter(s => s.trim());
        }
      }
      setExpertiseItems(expertiseArray);
      setValue('expertise', expertiseArray);
      setValue('imageBackground', member.imageBackground || '');
      setValue('imageStyle', member.imageStyle || '');
      setValue('department', member.department || '');
      setValue('joinDate', member.joinDate ? member.joinDate.split('T')[0] : '');
      setValue('isActive', member.isActive ?? true);
      setValue('linkedinUrl', member.linkedinUrl || '');
      setValue('twitterUrl', member.twitterUrl || '');
      setValue('priorityOrder', member.priorityOrder || 0);
      setValue('websiteUrl', member.websiteUrl || '');
    }
  }, [member, setValue]);

  // Handle expertise items changes
  const handleExpertiseChange = (index: number, value: string) => {
    const newExpertiseItems = [...expertiseItems];
    newExpertiseItems[index] = value;
    setExpertiseItems(newExpertiseItems);
    setValue('expertise', newExpertiseItems);
  };

  const addExpertiseItem = () => {
    const newExpertiseItems = [...expertiseItems, ''];
    setExpertiseItems(newExpertiseItems);
    setValue('expertise', newExpertiseItems);
  };

  const removeExpertiseItem = (index: number) => {
    if (expertiseItems.length > 1) {
      const newExpertiseItems = expertiseItems.filter((_, i) => i !== index);
      setExpertiseItems(newExpertiseItems);
      setValue('expertise', newExpertiseItems);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return member?.profileImageUrl || null;

    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('type', 'profile');
      formData.append('entity', 'executive-committee-member');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const result = await response.json();
      return result.url;
    } catch (error) {
      console.error('Image upload failed:', error);
      return null;
    }
  };

  const onSubmit = async (data: ExecutiveCommitteeTeamMemberFormData) => {
    setIsSubmitting(true);
    setUploadProgress(10);

    try {
      // Handle image upload if there's a new image
      let profileImageUrl = member?.profileImageUrl;
      if (imageFile) {
        // Simulate upload progress
        setUploadProgress(30);
        await new Promise(resolve => setTimeout(resolve, 500));
        setUploadProgress(70);
        await new Promise(resolve => setTimeout(resolve, 500));
        setUploadProgress(100);

        // For now, we'll use a placeholder URL
        // In a real implementation, you'd upload to your image service
        profileImageUrl = `https://via.placeholder.com/400x400/teal/white?text=${encodeURIComponent(data.firstName.charAt(0) + data.lastName.charAt(0))}`;
      }

      // Filter out empty expertise items and convert to JSON string for backend
      const filteredExpertise = data.expertise.filter(item => item.trim());
      const expertiseString = filteredExpertise.length > 0 ?
        JSON.stringify(filteredExpertise) : undefined;

      const memberData = {
        ...data,
        profileImageUrl,
        joinDate: data.joinDate ? new Date(data.joinDate).toISOString() : undefined,
        expertise: expertiseString
      };

      let result: ExecutiveCommitteeTeamMemberDTO | null = null;

      if (member?.id) {
        // Update existing member
        result = await updateExecutiveCommitteeMember(member.id, memberData);
      } else {
        // Create new member
        result = await createExecutiveCommitteeMember(memberData);
      }

      if (result) {
        onSuccess(result);
      } else {
        throw new Error('Failed to save member');
      }
    } catch (error) {
      console.error('Form submission failed:', error);
      alert('Failed to save member. Please try again.');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Image Upload Section */}
      <div className="space-y-4">
        <label className="block font-medium">Profile Photo</label>
        <div className="flex items-center space-x-4">
          <div className="relative">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Profile preview"
                  className="h-24 w-24 rounded-full object-cover border-2 border-gray-200"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="h-24 w-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                <FaUpload className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
            />
            <p className="mt-1 text-xs text-gray-500">
              PNG, JPG, GIF up to 10MB. Recommended: 400x400 pixels.
            </p>
          </div>
        </div>
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-teal-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">First Name *</label>
          <input
            type="text"
            {...register('firstName', { required: 'First name is required' })}
            className={`w-full border rounded p-2 ${errors.firstName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
          />
          {errors.firstName && (
            <div className="text-red-500 text-sm mt-1">{errors.firstName.message}</div>
          )}
        </div>

        <div>
          <label className="block font-medium">Last Name *</label>
          <input
            type="text"
            {...register('lastName', { required: 'Last name is required' })}
            className={`w-full border rounded p-2 ${errors.lastName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
          />
          {errors.lastName && (
            <div className="text-red-500 text-sm mt-1">{errors.lastName.message}</div>
          )}
        </div>

        <div>
          <label className="block font-medium">Title *</label>
          <input
            type="text"
            {...register('title', { required: 'Title is required' })}
            className={`w-full border rounded p-2 ${errors.title ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
          />
          {errors.title && (
            <div className="text-red-500 text-sm mt-1">{errors.title.message}</div>
          )}
        </div>

        <div>
          <label className="block font-medium">Designation</label>
          <input
            type="text"
            {...register('designation')}
            className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-medium">Department</label>
          <input
            type="text"
            {...register('department')}
            className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-medium">Join Date</label>
          <input
            type="date"
            {...register('joinDate')}
            className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-medium">Priority Order</label>
          <input
            type="number"
            {...register('priorityOrder', { valueAsNumber: true })}
            className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            {...register('email')}
            className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Bio and Expertise */}
      <div>
        <label className="block font-medium">Bio</label>
        <textarea
          {...register('bio')}
          rows={4}
          className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-blue-500"
          placeholder="Brief biography of the team member..."
        />
      </div>

      <div>
        <label className="block font-medium">Expertise</label>
        <div className="space-y-2">
          <p className="text-xs text-gray-500 mb-3">
            Add expertise areas one by one. Examples: Leadership, Strategic Planning, Finance, Marketing, Team Building
          </p>
          {expertiseItems.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => handleExpertiseChange(index, e.target.value)}
                className="flex-1 border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., Leadership"
              />
              {expertiseItems.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeExpertiseItem(index)}
                  className="text-red-600 hover:text-red-800 p-2 rounded-md hover:bg-red-50 transition-colors"
                  title="Remove expertise item"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addExpertiseItem}
            className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-2 rounded-md transition-colors"
            title="Add expertise item"
          >
            <FaPlus className="w-4 h-4" />
            Add Expertise
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Each expertise area will be stored as a separate item in the system.
        </p>
      </div>

      {/* Image Styling */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Image Background</label>
          <input
            type="text"
            {...register('imageBackground')}
            className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-blue-500"
            placeholder="e.g., teal, blue, gradient"
          />
        </div>

        <div>
          <label className="block font-medium">Image Style</label>
          <input
            type="text"
            {...register('imageStyle')}
            className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-blue-500"
            placeholder="e.g., modern, classic, corporate"
          />
        </div>
      </div>

      {/* Social Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block font-medium">LinkedIn URL</label>
          <input
            type="url"
            {...register('linkedinUrl')}
            className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-blue-500"
            placeholder="https://linkedin.com/in/..."
          />
        </div>

        <div>
          <label className="block font-medium">Twitter URL</label>
          <input
            type="url"
            {...register('twitterUrl')}
            className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-blue-500"
            placeholder="https://twitter.com/..."
          />
        </div>

        <div>
          <label className="block font-medium">Website URL</label>
          <input
            type="url"
            {...register('websiteUrl')}
            className="w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-blue-500"
            placeholder="https://..."
          />
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center">
        <input
          type="checkbox"
          {...register('isActive')}
          className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
        />
        <label className="ml-2 block text-sm text-gray-900">
          Active member
        </label>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2 transition-colors disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              {member ? 'Update' : 'Create'} Member
            </>
          )}
        </button>
      </div>
    </form>
  );
}
