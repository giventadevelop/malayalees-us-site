'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FaEdit, FaTrashAlt, FaEye, FaLinkedin, FaTwitter, FaGlobe, FaUpload } from 'react-icons/fa';
import type { ExecutiveCommitteeTeamMemberDTO } from '@/types/executiveCommitteeTeamMember';
import ReactDOM from 'react-dom';

interface ExecutiveCommitteeListProps {
  members: ExecutiveCommitteeTeamMemberDTO[];
  onEdit: (member: ExecutiveCommitteeTeamMemberDTO) => void;
  onView: (member: ExecutiveCommitteeTeamMemberDTO) => void;
  onDelete: (member: ExecutiveCommitteeTeamMemberDTO) => void;
  onUpload: (member: ExecutiveCommitteeTeamMemberDTO) => void;
}

// DetailsTooltip component following the UI style guide
function MemberDetailsTooltip({ member, anchorRect, onClose }: {
  member: ExecutiveCommitteeTeamMemberDTO,
  anchorRect: DOMRect | null,
  onClose: () => void
}) {
  if (!anchorRect) return null;

  const tooltipWidth = 400;
  const spacing = 8;

  // Always show tooltip to the right of the anchor cell, never above the columns
  let top = anchorRect.top;
  let left = anchorRect.right + spacing;

  // Clamp position to stay within the viewport
  const estimatedHeight = 300; // Heuristic average height
  if (top + estimatedHeight > window.innerHeight) {
    top = window.innerHeight - estimatedHeight - spacing;
  }
  if (top < spacing) {
    top = spacing;
  }
  if (left + tooltipWidth > window.innerWidth) {
    left = window.innerWidth - tooltipWidth - spacing;
  }

  const style: React.CSSProperties = {
    position: 'fixed',
    top,
    left,
    zIndex: 9999,
    width: tooltipWidth,
    background: 'white',
    border: '1px solid #cbd5e1',
    borderRadius: 8,
    boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
    padding: '16px',
    fontSize: '14px',
    maxHeight: '400px',
    overflowY: 'auto',
    transition: 'opacity 0.1s ease-in-out',
  };

  return ReactDOM.createPortal(
    <div style={style} tabIndex={-1} className="admin-tooltip">
      {/* Sticky, always-visible close button */}
      <div className="sticky top-0 right-0 z-10 bg-white flex justify-end">
        <button
          onClick={onClose}
          className="w-10 h-10 text-2xl bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all"
          aria-label="Close tooltip"
        >
          &times;
        </button>
      </div>

      {/* Tooltip content */}
      <div className="space-y-4">
        <div className="border-b border-gray-200 pb-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {member.firstName} {member.lastName}
          </h3>
          <div className="text-sm text-gray-600">
            <p><strong>Designation:</strong> {member.designation || 'Not specified'}</p>
            <p><strong>Title:</strong> {member.title || 'Not specified'}</p>
            <p><strong>Department:</strong> {member.department || 'Not specified'}</p>
          </div>
        </div>

        <div className="border-b border-gray-200 pb-3">
          <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Email:</strong> {member.email || 'Not provided'}</p>
            {member.linkedinUrl && (
              <p><strong>LinkedIn:</strong> <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">View Profile</a></p>
            )}
            {member.twitterUrl && (
              <p><strong>Twitter:</strong> <a href={member.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600">View Profile</a></p>
            )}
            {member.websiteUrl && (
              <p><strong>Website:</strong> <a href={member.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800">Visit Site</a></p>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-2">Expertise & Details</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Expertise:</strong> {
              member.expertise ? (
                Array.isArray(member.expertise) ?
                  member.expertise.join(', ') :
                  typeof member.expertise === 'string' ?
                    (member.expertise.startsWith('[') ?
                      JSON.parse(member.expertise).join(', ') :
                      member.expertise
                    ) :
                    'Not specified'
              ) : 'Not specified'
            }</p>
            <p><strong>Status:</strong> <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${member.isActive
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
              }`}>
              {member.isActive ? 'Active' : 'Inactive'}
            </span></p>
            <p><strong>Priority Order:</strong> {member.priorityOrder || 'Not set'}</p>
            {member.bio && <p><strong>Bio:</strong> {member.bio}</p>}
            {member.joinDate && <p><strong>Join Date:</strong> {new Date(member.joinDate).toLocaleDateString()}</p>}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function ExecutiveCommitteeList({
  members,
  onEdit,
  onView,
  onDelete,
  onUpload,
}: ExecutiveCommitteeListProps) {
  // Tooltip state management
  const [tooltipMember, setTooltipMember] = useState<ExecutiveCommitteeTeamMemberDTO | null>(null);
  const [tooltipAnchor, setTooltipAnchor] = useState<DOMRect | null>(null);
  const tooltipTimer = useRef<NodeJS.Timeout | null>(null);

  // Tooltip handlers
  const handleMouseEnter = (member: ExecutiveCommitteeTeamMemberDTO, e: React.MouseEvent) => {
    if (tooltipTimer.current) {
      clearTimeout(tooltipTimer.current);
    }
    setTooltipMember(member);
    setTooltipAnchor((e.currentTarget as HTMLElement).getBoundingClientRect());
  };

  const handleMouseLeave = () => {
    tooltipTimer.current = setTimeout(() => {
      setTooltipMember(null);
    }, 200);
  };

  const handleTooltipClose = () => {
    if (tooltipTimer.current) clearTimeout(tooltipTimer.current);
    setTooltipMember(null);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (tooltipTimer.current) clearTimeout(tooltipTimer.current);
    };
  }, []);

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
    <div className="bg-white shadow-sm rounded-lg overflow-hidden mx-8 my-6">
      {/* Tooltip note for users */}
      <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
        <p className="text-sm text-blue-700">
          💡 <strong>Tip:</strong> Hover over the Member or Title & Department columns to see detailed information in a tooltip.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Member
              </th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title & Department
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td
                  className="px-3 py-3 whitespace-nowrap cursor-pointer"
                  onMouseEnter={(e) => handleMouseEnter(member, e)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {member.profileImageUrl ? (
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={member.profileImageUrl}
                          alt={`${member.firstName} ${member.lastName}`}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center">
                          <span className="text-teal-600 font-semibold text-sm">
                            {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {member.firstName} {member.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {member.designation || 'No designation'}
                      </div>
                    </div>
                  </div>
                </td>
                <td
                  className="px-2 py-3 whitespace-nowrap cursor-pointer"
                  onMouseEnter={(e) => handleMouseEnter(member, e)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="text-sm text-gray-900">{member.title}</div>
                  <div className="text-sm text-gray-500">{member.department || 'No department'}</div>
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onView(member)}
                      className="text-blue-600 hover:text-blue-900 p-1.5 rounded hover:bg-blue-50"
                      title="View details"
                    >
                      <FaEye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(member)}
                      className="text-teal-600 hover:text-teal-900 p-1.5 rounded hover:bg-teal-50"
                      title="Edit member"
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(member)}
                      className="text-red-600 hover:text-red-900 p-1.5 rounded hover:bg-red-50"
                      title="Delete member"
                    >
                      <FaTrashAlt className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onUpload(member)}
                      className="text-purple-600 hover:text-purple-900 p-1.5 rounded hover:bg-purple-50"
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

      {/* Tooltip */}
      {tooltipMember && (
        <MemberDetailsTooltip
          member={tooltipMember}
          anchorRect={tooltipAnchor}
          onClose={handleTooltipClose}
        />
      )}
    </div>
  );
}
