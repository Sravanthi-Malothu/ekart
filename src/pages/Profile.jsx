import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '@/redux/userSlice';
import { toast } from 'sonner';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Camera, Trash2, Pencil } from 'lucide-react';

const API_URL = '/api/v1';

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });
  const [profilePic, setProfilePic] = useState(user?.profilePic || '');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const { data } = await axios.get(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (data.success) {
          setFormData({
            firstName: data.user.firstName || '',
            lastName: data.user.lastName || '',
            email: data.user.email || '',
          });
          setProfilePic(data.user.profilePic || '');
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const accessToken = localStorage.getItem('accessToken');
      const { data } = await axios.put(
        `${API_URL}/user/updateProfile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (data.success) {
        toast.success('Profile updated successfully');
        dispatch(setUser(data.user));
        setIsEditing(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formDataUpload = new FormData();
    formDataUpload.append('profilePic', file);
    try {
      const accessToken = localStorage.getItem('accessToken');
      const { data } = await axios.post(`${API_URL}/user/uploadProfilePic`, formDataUpload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      if (data.success) {
        toast.success('Profile picture updated');
        setProfilePic(data.user.profilePic);
        dispatch(setUser(data.user));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;
    try {
      const accessToken = localStorage.getItem('accessToken');
      const { data } = await axios.delete(`${API_URL}/user/deleteAccount`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (data.success) {
        toast.success('Account deleted');
        localStorage.removeItem('accessToken');
        dispatch(setUser(null));
        window.location.href = '/';
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <>
      <Navbar />
      <div className="pt-24 min-h-screen bg-gray-50 pb-12">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h1>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 rounded-full overflow-hidden bg-gray-200">
                  {profilePic ? (
                    <img src={profilePic} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-2xl font-bold text-gray-500">
                      {formData.firstName?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
                <div>
                  <CardTitle className="text-2xl">{formData.firstName} {formData.lastName}</CardTitle>
                  <CardDescription>{formData.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-3">
                <Label htmlFor="profilePic" className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100">
                  <Camera className="h-4 w-4" />
                  Upload Photo
                  <Input id="profilePic" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </Label>
                <Button variant="outline" onClick={() => setIsEditing((prev) => !prev)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} disabled={!isEditing} />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} disabled={!isEditing} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} disabled={!isEditing} />
                </div>
                {isEditing && (
                  <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                )}
              </form>

              <div className="pt-6 border-t">
                <Button variant="destructive" onClick={handleDeleteAccount} className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
