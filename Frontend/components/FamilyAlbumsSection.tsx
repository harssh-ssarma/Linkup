import React, { useState, useEffect } from 'react';
import { 
  FaPlus, 
  FaUsers, 
  FaHeart, 
  FaComment, 
  FaShare, 
  FaCog,
  FaCamera,
  FaVideo,
  FaCalendarAlt
} from 'react-icons/fa';

interface FamilyMember {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
}

interface MediaItem {
  id: string;
  type: 'photo' | 'video';
  url: string;
  thumbnail?: string;
  caption?: string;
  uploadedBy: string;
  uploadedAt: string;
  likes: number;
  comments: number;
}

interface FamilyAlbum {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  members: FamilyMember[];
  mediaCount: number;
  lastUpdated: string;
  createdBy: string;
  privacy: 'family' | 'close_friends' | 'custom';
  isAdmin: boolean;
}

const FamilyAlbumsSection = () => {
  const [albums, setAlbums] = useState<FamilyAlbum[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<FamilyAlbum | null>(null);
  const [albumMedia, setAlbumMedia] = useState<MediaItem[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<'albums' | 'album_detail'>('albums');

  useEffect(() => {
    loadFamilyAlbums();
  }, []);

  const loadFamilyAlbums = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/family-albums');
      const data = await response.json();
      setAlbums(data.albums);
    } catch (error) {
      console.error('Failed to load family albums:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAlbumMedia = async (albumId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/family-albums/${albumId}/media`);
      const data = await response.json();
      setAlbumMedia(data.media);
    } catch (error) {
      console.error('Failed to load album media:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openAlbum = (album: FamilyAlbum) => {
    setSelectedAlbum(album);
    setView('album_detail');
    loadAlbumMedia(album.id);
  };

  const backToAlbums = () => {
    setView('albums');
    setSelectedAlbum(null);
    setAlbumMedia([]);
  };

  const CreateAlbumModal = () => {
    const [formData, setFormData] = useState({
      name: '',
      description: '',
      privacy: 'family' as 'family' | 'close_friends' | 'custom',
      selectedMembers: [] as string[]
    });

    const [availableContacts, setAvailableContacts] = useState<FamilyMember[]>([]);

    useEffect(() => {
      if (isCreateModalOpen) {
        // Load available contacts
        fetch('/api/contacts/family')
          .then(res => res.json())
          .then(data => setAvailableContacts(data.contacts));
      }
    }, [isCreateModalOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const response = await fetch('/api/family-albums', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        
        if (response.ok) {
          setIsCreateModalOpen(false);
          loadFamilyAlbums();
          setFormData({ name: '', description: '', privacy: 'family', selectedMembers: [] });
        }
      } catch (error) {
        console.error('Failed to create album:', error);
      }
    };

    if (!isCreateModalOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-xl font-bold mb-4">Create Family Album</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Album Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Privacy Setting
              </label>
              <select
                value={formData.privacy}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  privacy: e.target.value as 'family' | 'close_friends' | 'custom' 
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="family">Family Only</option>
                <option value="close_friends">Close Friends</option>
                <option value="custom">Custom Selection</option>
              </select>
            </div>

            {formData.privacy === 'custom' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Members
                </label>
                <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-2">
                  {availableContacts.map((contact) => (
                    <label key={contact.id} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        checked={formData.selectedMembers.includes(contact.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              selectedMembers: [...prev.selectedMembers, contact.id]
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              selectedMembers: prev.selectedMembers.filter(id => id !== contact.id)
                            }));
                          }
                        }}
                        className="mr-2"
                      />
                      <img src={contact.avatar} alt={contact.name} className="w-6 h-6 rounded-full mr-2" />
                      <span className="text-sm">{contact.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Album
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const AlbumsGrid = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Family Albums</h2>
          <p className="text-gray-600">Private photo & video collections for your loved ones</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FaPlus className="mr-2" />
          Create Album
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : albums.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FaUsers className="text-4xl text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Family Albums Yet</h3>
          <p className="text-gray-500 mb-4">Create your first family album to start sharing memories</p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Your First Album
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album) => (
            <div
              key={album.id}
              onClick={() => openAlbum(album)}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48 bg-gray-200">
                <img
                  src={album.coverImage}
                  alt={album.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                  {album.mediaCount} items
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-1">{album.name}</h3>
                {album.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{album.description}</p>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex -space-x-2">
                      {album.members.slice(0, 3).map((member) => (
                        <img
                          key={member.id}
                          src={member.avatar}
                          alt={member.name}
                          className="w-6 h-6 rounded-full border-2 border-white"
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">
                      {album.members.length} member{album.members.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <span className="text-xs text-gray-500">
                    Updated {album.lastUpdated}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const AlbumDetail = () => {
    if (!selectedAlbum) return null;

    return (
      <div>
        {/* Album Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={backToAlbums}
              className="text-blue-600 hover:text-blue-700"
            >
              ← Back to Albums
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{selectedAlbum.name}</h2>
              {selectedAlbum.description && (
                <p className="text-gray-600">{selectedAlbum.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:text-gray-700">
              <FaCamera />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-700">
              <FaVideo />
            </button>
            {selectedAlbum.isAdmin && (
              <button className="p-2 text-gray-600 hover:text-gray-700">
                <FaCog />
              </button>
            )}
          </div>
        </div>

        {/* Album Members */}
        <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <FaUsers className="text-gray-600" />
          <div className="flex items-center space-x-2">
            {selectedAlbum.members.map((member) => (
              <div key={member.id} className="relative">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-8 h-8 rounded-full"
                />
                {member.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {selectedAlbum.members.length} member{selectedAlbum.members.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Media Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : albumMedia.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FaCamera className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No memories yet</h3>
            <p className="text-gray-500">Start sharing photos and videos with your family</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {albumMedia.map((media) => (
              <div key={media.id} className="relative bg-gray-200 rounded-lg overflow-hidden aspect-square">
                {media.type === 'photo' ? (
                  <img
                    src={media.url}
                    alt=""
                    className="w-full h-full object-cover cursor-pointer hover:opacity-90"
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <img
                      src={media.thumbnail || media.url}
                      alt=""
                      className="w-full h-full object-cover cursor-pointer hover:opacity-90"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FaVideo className="text-white text-2xl drop-shadow-lg" />
                    </div>
                  </div>
                )}

                {/* Media actions overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-40 transition-all duration-200 flex items-end opacity-0 hover:opacity-100">
                  <div className="w-full p-2 text-white">
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-3">
                        <button className="flex items-center space-x-1">
                          <FaHeart className="text-sm" />
                          <span className="text-xs">{media.likes}</span>
                        </button>
                        <button className="flex items-center space-x-1">
                          <FaComment className="text-sm" />
                          <span className="text-xs">{media.comments}</span>
                        </button>
                      </div>
                      <button>
                        <FaShare className="text-sm" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {view === 'albums' ? <AlbumsGrid /> : <AlbumDetail />}
        <CreateAlbumModal />
      </div>
    </div>
  );
};

export default FamilyAlbumsSection;
