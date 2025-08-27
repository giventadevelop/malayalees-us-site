'use client';

import { FaEdit, FaTrashAlt, FaEye, FaLinkedin, FaTwitter, FaGlobe, FaUpload } from 'react-icons/fa';
import type { ExecutiveCommitteeTeamMemberDTO } from '@/types/executiveCommitteeTeamMember';

interface ExecutiveCommitteeListProps {
  members: ExecutiveCommitteeTeamMemberDTO[];
  onEdit: (member: ExecutiveCommitteeTeamMemberDTO) => void;
  onView: (member: ExecutiveCommitteeTeamMemberDTO) => void;
  onDelete: (member: ExecutiveCommitteeTeamMemberDTO) => void;
  onUpload: (member: ExecutiveCommitteeTeamMemberDTO) => void;
}

export default function ExecutiveCommitteeList({
  members,
  onEdit,
  onView,
  onDelete,
  onUpload,
}: ExecutiveCommitteeListProps) {
  if (members.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">👥</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No team members yet</h3>
        <p className="text-gray-500">Get started by adding your first executive committee member.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Member
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title & Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expertise
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                      {member.profileImageUrl ? (
                        <img
                          className="h-12 w-12 rounded-full object-cover"
                          src={member.profileImageUrl}
                          alt={`${member.firstName} ${member.lastName}`}
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center">
                          <span className="text-teal-600 font-semibold text-lg">
                            {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {member.firstName} {member.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {member.designation || 'No designation'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{member.title}</div>
                  <div className="text-sm text-gray-500">{member.department || 'No department'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{member.email || 'No email'}</div>
                  <div className="flex items-center gap-2 mt-1">
                    {member.linkedinUrl && (
                      <a
                        href={member.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaLinkedin className="w-4 h-4" />
                      </a>
                    )}
                    {member.twitterUrl && (
                      <a
                        href={member.twitterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-600"
                      >
                        <FaTwitter className="w-4 h-4" />
                      </a>
                    )}
                    {member.websiteUrl && (
                      <a
                        href={member.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <FaGlobe className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {member.expertise ? (
                      Array.isArray(member.expertise) ?
                        member.expertise.join(', ') :
                        typeof member.expertise === 'string' ?
                          (member.expertise.startsWith('[') ?
                            JSON.parse(member.expertise).join(', ') :
                            member.expertise
                          ) :
                          'No expertise listed'
                    ) : 'No expertise listed'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${member.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                    }`}>
                    {member.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {member.priorityOrder || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onView(member)}
                      className="text-blue-600 hover:text-blue-900 p-1"
                      title="View details"
                    >
                      <FaEye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(member)}
                      className="text-teal-600 hover:text-teal-900 p-1"
                      title="Edit member"
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(member)}
                      className="text-red-600 hover:text-red-900 p-1"
                      title="Delete member"
                    >
                      <FaTrashAlt className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onUpload(member)}
                      className="text-purple-600 hover:text-purple-900 p-1"
                      title="Upload profile image"
                    >
                      <FaUpload className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
