import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_LIST } from '../services/api-list';
import UserFormPanel from '../components/UserFormPanel';
import ConfirmDialog from '../components/ConfirmDialog';
import { Pencil, Trash2, ArrowUp, ArrowDown, ArrowUpDown, Filter } from 'lucide-react';

export default function Dashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState('All');
  const [ageFilter, setAgeFilter] = useState('All');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('DESC');

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [tempGender, setTempGender] = useState('All');
  const [tempAge, setTempAge] = useState('All');

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}${API_LIST.USERS}?page=${page}&limit=10&q=${debouncedSearch}&sortBy=${sortBy}&order=${order}&gender=${genderFilter}&ageRange=${ageFilter}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.status === 401 || res.status === 403) {
        navigate('/login');
        return;
      }

      const data = await res.json();
      setUsers(data.data || []);
      setTotalPages(data.totalPages || 1);
      setTotalRecords(data.total || 0);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search input
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  // Fetch immediately when dependencies change
  useEffect(() => {
    fetchUsers();
  }, [page, debouncedSearch, sortBy, order, genderFilter, ageFilter]);

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setOrder(order === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(column);
      setOrder('ASC');
    }
    setPage(1);
  };

  const renderSortIcon = (column: string) => {
    if (sortBy !== column) return <ArrowUpDown size={14} className="text-gray-400 opacity-50 group-hover:opacity-100" />;
    return order === 'ASC' ? <ArrowUp size={14} className="text-blue-500" /> : <ArrowDown size={14} className="text-blue-500" />;
  };

  const handleOpenCreate = () => {
    setEditingUser(null);
    setIsPanelOpen(true);
  };

  const handleOpenEdit = (user: any) => {
    setEditingUser(user);
    setIsPanelOpen(true);
  };

  const confirmDelete = (id: number) => {
    setUserToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (userToDelete === null) return;
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      await fetch(`${apiUrl}${API_LIST.USERS}/${userToDelete}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setDeleteConfirmOpen(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
      setDeleteConfirmOpen(false);
      setUserToDelete(null);
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const url = editingUser ? `${apiUrl}${API_LIST.USERS}/${editingUser.id}` : `${apiUrl}${API_LIST.USERS}`;
      const method = editingUser ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        setIsPanelOpen(false);
        fetchUsers();
      } else {
        alert("Error saving user");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <UserFormPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingUser}
      />
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <div className="flex gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name/email"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-8 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-64"
            />
            <svg className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <div className="relative">
            <button
              onClick={() => {
                setTempGender(genderFilter);
                setTempAge(ageFilter);
                setIsFilterOpen(!isFilterOpen);
              }}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <Filter size={16} className="text-gray-500" />
              Filters
            </button>
            
            {isFilterOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)}></div>
                <div className="absolute top-12 right-0 bg-white border border-gray-200 rounded-lg shadow-lg w-64 z-50">
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-800 text-sm">Filters</h3>
                  </div>
                  <div className="p-4">
                    <div className="mb-5">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Gender</h4>
                      <div className="space-y-2.5">
                        {['Male', 'Female'].map(g => (
                          <label key={g} className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                              checked={tempGender === g}
                              onChange={() => setTempGender(tempGender === g ? 'All' : g)}
                            />
                            {g}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Age Range</h4>
                      <div className="space-y-2.5">
                        {['18-25', '26-35', '36-45', '46+'].map(a => (
                          <label key={a} className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                              checked={tempAge === a}
                              onChange={() => setTempAge(tempAge === a ? 'All' : a)}
                            />
                            {a}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="p-3 border-t border-gray-100 flex justify-between items-center bg-gray-50 rounded-b-lg">
                    <button 
                      onClick={() => { setTempGender('All'); setTempAge('All'); setGenderFilter('All'); setAgeFilter('All'); setPage(1); setIsFilterOpen(false); }}
                      className="text-sm text-gray-500 hover:text-gray-700 font-medium"
                    >
                      Clear
                    </button>
                    <button 
                      onClick={() => { setGenderFilter(tempGender); setAgeFilter(tempAge); setPage(1); setIsFilterOpen(false); }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
          <button
            onClick={handleOpenCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Create New User
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col border border-gray-100 rounded-lg overflow-hidden min-h-0">
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#f8f9fc] text-gray-600 font-semibold border-b border-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3">S.No</th>
                <th className="px-4 py-3 cursor-pointer group hover:bg-gray-100 transition-colors" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-2">Name {renderSortIcon('name')}</div>
                </th>
                <th className="px-4 py-3 cursor-pointer group hover:bg-gray-100 transition-colors" onClick={() => handleSort('email')}>
                  <div className="flex items-center gap-2">Email {renderSortIcon('email')}</div>
                </th>
                <th className="px-4 py-3 cursor-pointer group hover:bg-gray-100 transition-colors" onClick={() => handleSort('age')}>
                  <div className="flex items-center gap-2">Age {renderSortIcon('age')}</div>
                </th>
                <th className="px-4 py-3 cursor-pointer group hover:bg-gray-100 transition-colors" onClick={() => handleSort('gender')}>
                  <div className="flex items-center gap-2">Gender {renderSortIcon('gender')}</div>
                </th>
                <th className="px-4 py-3 cursor-pointer group hover:bg-gray-100 transition-colors" onClick={() => handleSort('company')}>
                  <div className="flex items-center gap-2">Company {renderSortIcon('company')}</div>
                </th>
                <th className="px-4 py-3 cursor-pointer group hover:bg-gray-100 transition-colors" onClick={() => handleSort('role')}>
                  <div className="flex items-center gap-2">Role {renderSortIcon('role')}</div>
                </th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-20">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                      <span className="text-gray-500 font-medium text-sm">Loading records...</span>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-500">No users found.</td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-gray-500">{(page - 1) * 10 + index + 1}</td>
                    <td className="px-4 py-3 text-gray-600 font-medium">{user.name}</td>
                    <td className="px-4 py-3 text-gray-500">{user.email}</td>
                    <td className="px-4 py-3 text-gray-500">{user.age}</td>
                    <td className="px-4 py-3 text-gray-500">{user.gender}</td>
                    <td className="px-4 py-3 text-gray-600">{user.company || "-"}</td>
                    <td className="px-4 py-3 text-gray-600">{user.role}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleOpenEdit(user)}
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => confirmDelete(user.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="shrink-0 flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-white">
          <div className="text-sm text-gray-500">
            Showing {totalRecords === 0 ? 0 : (page - 1) * 10 + 1} to {Math.min(page * 10, totalRecords)} of {totalRecords} results
          </div>
          <div className="flex items-center gap-1 text-sm">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="px-2.5 py-1 border border-gray-200 rounded text-gray-400 hover:bg-gray-50 disabled:opacity-50"
            >&laquo;</button>
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className="px-2.5 py-1 border border-gray-200 rounded text-gray-400 hover:bg-gray-50 disabled:opacity-50"
            >&lsaquo;</button>
            <span className="px-2 text-gray-600">Page {page} of {totalPages}</span>
            <button
              onClick={handleNextPage}
              disabled={page === totalPages || totalPages === 0}
              className="px-2.5 py-1 border border-gray-200 rounded text-blue-600 border-blue-200 hover:bg-blue-50 disabled:opacity-50"
            >&rsaquo;</button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages || totalPages === 0}
              className="px-2.5 py-1 border border-gray-200 rounded text-blue-600 border-blue-200 hover:bg-blue-50 disabled:opacity-50"
            >&raquo;</button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => { setDeleteConfirmOpen(false); setUserToDelete(null); }}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        isDestructive={true}
      />
    </div>
  );
}
