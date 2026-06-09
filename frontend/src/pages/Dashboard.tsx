import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_LIST } from '../services/api-list';
import ClientFormPanel from '../components/ClientFormPanel';
import { Pencil, Trash2 } from 'lucide-react';

export default function Dashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('DESC');

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api${API_LIST.USERS}?page=${page}&limit=10&q=${search}&sortBy=${sortBy}&order=${order}`, {
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

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [page, search, sortBy, order]);

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleOpenCreate = () => {
    setEditingUser(null);
    setIsPanelOpen(true);
  };

  const handleOpenEdit = (user: any) => {
    setEditingUser(user);
    setIsPanelOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this client?")) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api${API_LIST.USERS}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      const token = localStorage.getItem('token');
      const url = editingUser ? `http://localhost:5000/api${API_LIST.USERS}/${editingUser.id}` : `http://localhost:5000/api${API_LIST.USERS}`;
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
        alert("Error saving client");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <ClientFormPanel 
        isOpen={isPanelOpen} 
        onClose={() => setIsPanelOpen(false)} 
        onSubmit={handleFormSubmit} 
        initialData={editingUser} 
      />
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
        <div className="flex gap-3">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search" 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-8 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-64"
            />
            <svg className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <select 
            className="border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-600 bg-white"
            value={`${sortBy}-${order}`}
            onChange={(e) => {
              const [newSortBy, newOrder] = e.target.value.split('-');
              setSortBy(newSortBy);
              setOrder(newOrder);
              setPage(1);
            }}
          >
            <option value="createdAt-DESC">Most Recent</option>
            <option value="createdAt-ASC">Oldest</option>
            <option value="name-ASC">Name (A-Z)</option>
            <option value="name-DESC">Name (Z-A)</option>
          </select>
          <button className="border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-600 bg-white flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
            Filters
          </button>
          <button 
            onClick={handleOpenCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Create New Client
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col border border-gray-100 rounded-lg overflow-hidden min-h-0">
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#f8f9fc] text-gray-600 font-semibold border-b border-gray-100 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3">S.No</th>
              <th className="px-4 py-3">Company Name</th>
              <th className="px-4 py-3">Contact Person</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Age / Gender</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-10 text-gray-500">Loading data...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-10 text-gray-500">No users found.</td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-gray-500">{(page - 1) * 10 + index + 1}</td>
                  <td className="px-4 py-3 text-gray-700 font-medium">{user.company || "-"}</td>
                  <td className="px-4 py-3 text-gray-600">{user.name}</td>
                  <td className="px-4 py-3 text-gray-500">{user.email}</td>
                  <td className="px-4 py-3 text-gray-600">{user.role}</td>
                  <td className="px-4 py-3 text-gray-500">{user.age} / {user.gender}</td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium border border-green-200 text-green-600 bg-green-50/50">
                      Active
                    </span>
                  </td>
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
                         onClick={() => handleDelete(user.id)} 
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
    </div>
  );
}
