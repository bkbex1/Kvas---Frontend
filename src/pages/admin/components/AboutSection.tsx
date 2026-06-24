import { useEffect, useState } from 'react';
import { apiGet, apiSend, apiUploadImage, toImageSrc } from '@/lib/api';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  imgQuery: string;
}

interface Value {
  icon: string;
  title: string;
  desc: string;
  color: string;
}

interface AboutContent {
  heroTitle: string;
  heroSubtitle: string;
  storyTitle: string;
  storyP1: string;
  storyP2: string;
  storyP3: string;
  values: Value[];
}

export default function AboutSection() {
  const [about, setAbout] = useState<AboutContent | null>(null);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [activeTab, setActiveTab] = useState<'content' | 'team' | 'values'>('content');
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [showAddMember, setShowAddMember] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [newMember, setNewMember] = useState<Omit<TeamMember, 'id'>>({
    name: '',
    role: '',
    bio: '',
    imgQuery: 'professional portrait smiling warm studio lighting natural tones friendly confident',
  });

  useEffect(() => {
    apiGet<any>('/api/admin/content/about')
      .then((data) => {
        setAbout(data.aboutContent || null);
        setTeam(Array.isArray(data.teamMembers) ? data.teamMembers : []);
      })
      .catch(() => {
        setAbout(null);
        setTeam([]);
      });
  }, []);

  if (!about) return null;

  const handleSave = async () => {
    await apiSend('/api/admin/content/about/content', 'PUT', about);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleDeleteMember = async (id: number) => {
    await apiSend(`/api/admin/content/about/team/${id}`, 'DELETE');
    setTeam(prev => prev.filter(m => m.id !== id));
  };

  const handleAddMember = async () => {
    if (!newMember.name || !newMember.role) return;
    const payload = { ...newMember };
    const response = await apiSend<any>('/api/admin/content/about/team', 'POST', payload);
    const nextTeam = Array.isArray(response?.teamMembers) ? response.teamMembers : null;
    if (nextTeam) {
      setTeam(nextTeam);
    } else {
      const newId = Math.max(...team.map(m => m.id), 0) + 1;
      setTeam(prev => [...prev, { ...newMember, id: newId }]);
    }
    setNewMember({ name: '', role: '', bio: '', imgQuery: 'professional portrait smiling warm studio lighting natural tones friendly confident' });
    setShowAddMember(false);
  };

  const handleSaveMember = async (updated: TeamMember) => {
    await apiSend(`/api/admin/content/about/team/${updated.id}`, 'PUT', updated);
    setTeam(prev => prev.map(m => m.id === updated.id ? updated : m));
    setEditingMember(null);
  };

  const uploadMemberImage = async (file: File | null, mode: 'new' | 'edit') => {
    if (!file) return;
    setUploadingImage(true);
    try {
      const response = await apiUploadImage('/api/admin/media/upload-image', file);
      if (mode === 'new') {
        setNewMember(prev => ({ ...prev, imgQuery: response.url }));
      } else {
        setEditingMember(prev => prev ? ({ ...prev, imgQuery: response.url }) : null);
      }
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[#2C1810]">Секция &quot;За Нас&quot;</h2>
          <p className="text-gray-600">Редактирайте съдържанието на страницата</p>
        </div>
        <button
          onClick={handleSave}
          className={`px-6 py-3 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${saved ? 'bg-green-600 text-white' : 'bg-[#2C1810] text-white hover:bg-[#3D2415]'}`}
        >
          <i className={saved ? 'ri-check-line' : 'ri-save-line'}></i>
          {saved ? 'Запазено!' : 'Запази Промените'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-[#F5F1EB] p-1 rounded-lg w-fit">
        {[
          { key: 'content', label: 'Основно Съдържание', icon: 'ri-file-text-line' },
          { key: 'team', label: 'Екип', icon: 'ri-team-line' },
          { key: 'values', label: 'Ценности', icon: 'ri-heart-line' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${activeTab === tab.key ? 'bg-white text-[#2C1810]' : 'text-gray-600 hover:text-[#2C1810]'}`}
          >
            <i className={tab.icon}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Tab */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6">
            <h3 className="text-lg font-bold text-[#2C1810] mb-4 flex items-center gap-2">
              <i className="ri-image-line text-[#D4AF37]"></i>
              Hero Секция
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Заглавие</label>
                <input
                  type="text"
                  value={about.heroTitle}
                  onChange={e => setAbout(prev => ({ ...prev, heroTitle: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Подзаглавие</label>
                <input
                  type="text"
                  value={about.heroSubtitle}
                  onChange={e => setAbout(prev => ({ ...prev, heroSubtitle: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6">
            <h3 className="text-lg font-bold text-[#2C1810] mb-4 flex items-center gap-2">
              <i className="ri-book-open-line text-[#D4AF37]"></i>
              История
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Заглавие на секцията</label>
                <input
                  type="text"
                  value={about.storyTitle}
                  onChange={e => setAbout(prev => ({ ...prev, storyTitle: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm"
                />
              </div>
              {[
                { key: 'storyP1', label: 'Параграф 1' },
                { key: 'storyP2', label: 'Параграф 2' },
                { key: 'storyP3', label: 'Параграф 3' },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                  <textarea
                    rows={3}
                    value={about[key as keyof AboutContent] as string}
                    onChange={e => setAbout(prev => ({ ...prev, [key]: e.target.value }))}
                    maxLength={500}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm resize-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Team Tab */}
      {activeTab === 'team' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">{team.length} членове в екипа</p>
            <button
              onClick={() => setShowAddMember(true)}
              className="px-4 py-2 bg-[#2C1810] text-white rounded-lg hover:bg-[#3D2415] cursor-pointer whitespace-nowrap text-sm flex items-center gap-2"
            >
              <i className="ri-user-add-line"></i>
              Добави Член
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {team.map(member => (
              <div key={member.id} className="bg-white rounded-xl p-4 flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={toImageSrc(member.imgQuery, member.name)}
                    alt={member.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-[#2C1810]">{member.name}</h4>
                  <p className="text-sm text-[#D4AF37] font-medium">{member.role}</p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{member.bio}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => setEditingMember({ ...member })}
                    className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                  >
                    <i className="ri-edit-line text-gray-600"></i>
                  </button>
                  <button
                    onClick={() => handleDeleteMember(member.id)}
                    className="p-2 hover:bg-red-50 rounded-lg cursor-pointer"
                  >
                    <i className="ri-delete-bin-line text-red-500"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Values Tab */}
      {activeTab === 'values' && (
        <div className="space-y-4">
          {about.values.map((value, idx) => (
            <div key={idx} className="bg-white rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-full" style={{ backgroundColor: value.color }}>
                  <i className={`${value.icon} text-[#2C1810]`}></i>
                </div>
                <h4 className="font-bold text-[#2C1810]">Ценност {idx + 1}</h4>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Заглавие</label>
                  <input
                    type="text"
                    value={value.title}
                    onChange={e => {
                      const updated = [...about.values];
                      updated[idx] = { ...updated[idx], title: e.target.value };
                      setAbout(prev => ({ ...prev, values: updated }));
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Иконка (Remix Icon class)</label>
                  <div className="flex items-center gap-2">
                    <i className={`${value.icon} text-[#2C1810] text-xl`}></i>
                    <input
                      type="text"
                      value={value.icon}
                      onChange={e => {
                        const updated = [...about.values];
                        updated[idx] = { ...updated[idx], icon: e.target.value };
                        setAbout(prev => ({ ...prev, values: updated }));
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm"
                    />
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Описание</label>
                  <textarea
                    rows={2}
                    value={value.desc}
                    maxLength={500}
                    onChange={e => {
                      const updated = [...about.values];
                      updated[idx] = { ...updated[idx], desc: e.target.value };
                      setAbout(prev => ({ ...prev, values: updated }));
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm resize-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Member Modal */}
      {editingMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-lg w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#2C1810]">Редактирай Член</h3>
              <button onClick={() => setEditingMember(null)} className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Снимка (предварителен преглед)</label>
                <div className="w-20 h-20 rounded-xl overflow-hidden mb-2">
                  <img src={toImageSrc(editingMember.imgQuery, editingMember.name)} alt="" className="w-full h-full object-cover object-top" />
                </div>
                <input
                  type="text"
                  placeholder="Описание на снимката (на английски)"
                  value={editingMember.imgQuery}
                  onChange={e => setEditingMember(prev => prev ? { ...prev, imgQuery: e.target.value } : null)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm"
                />
                <input type="file" accept="image/*" onChange={e => void uploadMemberImage(e.target.files?.[0] || null, 'edit')} className="mt-2 block w-full text-sm text-gray-600" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Имe</label>
                <input
                  type="text"
                  value={editingMember.name}
                  onChange={e => setEditingMember(prev => prev ? { ...prev, name: e.target.value } : null)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Позиция</label>
                <input
                  type="text"
                  value={editingMember.role}
                  onChange={e => setEditingMember(prev => prev ? { ...prev, role: e.target.value } : null)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Биография</label>
                <textarea
                  rows={3}
                  maxLength={500}
                  value={editingMember.bio}
                  onChange={e => setEditingMember(prev => prev ? { ...prev, bio: e.target.value } : null)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditingMember(null)} className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer whitespace-nowrap text-sm">Отказ</button>
              <button onClick={() => handleSaveMember(editingMember)} className="flex-1 py-2 bg-[#2C1810] text-white rounded-lg hover:bg-[#3D2415] cursor-pointer whitespace-nowrap text-sm">Запази</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-lg w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#2C1810]">Добави Нов Член</h3>
              <button onClick={() => setShowAddMember(false)} className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Снимка (описание на английски)</label>
                <input
                  type="text"
                  placeholder="professional woman portrait smiling warm lighting..."
                  value={newMember.imgQuery}
                  onChange={e => setNewMember(prev => ({ ...prev, imgQuery: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm"
                />
                <input type="file" accept="image/*" onChange={e => void uploadMemberImage(e.target.files?.[0] || null, 'new')} className="mt-2 block w-full text-sm text-gray-600" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Имe *</label>
                <input
                  type="text"
                  value={newMember.name}
                  onChange={e => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Позиция *</label>
                <input
                  type="text"
                  value={newMember.role}
                  onChange={e => setNewMember(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Биография</label>
                <textarea
                  rows={3}
                  maxLength={500}
                  value={newMember.bio}
                  onChange={e => setNewMember(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2C1810] text-sm resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddMember(false)} className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer whitespace-nowrap text-sm">Отказ</button>
              <button onClick={handleAddMember} className="flex-1 py-2 bg-[#2C1810] text-white rounded-lg hover:bg-[#3D2415] cursor-pointer whitespace-nowrap text-sm">Добави</button>
            </div>
          </div>
        </div>
      )}
      {uploadingImage && <p className="text-xs text-gray-500 mt-3">Качване на изображение...</p>}
    </>
  );
}
