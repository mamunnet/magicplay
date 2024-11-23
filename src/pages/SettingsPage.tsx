import { useState } from 'react';
import { AdminNavbar } from '../components/AdminNavbar';
import { Sidebar } from '../components/Sidebar';
import { Lock, User, Shield } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface PasswordChangeForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const SettingsPage = () => {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const { user, updatePassword } = useAuthStore();
  
  const { register, handleSubmit, reset, formState: { errors }, watch } = useForm<PasswordChangeForm>();
  const newPassword = watch('newPassword');

  const handlePasswordChange = async (data: PasswordChangeForm) => {
    try {
      setIsChangingPassword(true);

      // Call the updatePassword function from auth store
      await updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });

      toast.success('Password changed successfully');
      reset();
    } catch (error: any) {
      toast.error(error.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111827]">
      <AdminNavbar />
      <Sidebar />
      
      <div className="ml-64 pt-16 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#FFB800] mb-2">Settings</h1>
            <p className="text-gray-400">Manage your account settings and preferences</p>
          </div>

          <div className="bg-[#1F1D1B] rounded-lg border border-gray-700 overflow-hidden">
            {/* Profile Section */}
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-[#FFB800] flex items-center justify-center">
                  <User className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Profile Information</h2>
                  <p className="text-gray-400 text-sm mt-1">Update your account information</p>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300">Email</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="mt-1 block w-full px-3 py-2 bg-[#2A2826] border border-gray-700 rounded-lg text-gray-300 disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Role</label>
                  <div className="mt-1 flex items-center space-x-2 text-gray-300">
                    <Shield className="w-4 h-4" />
                    <span>Administrator</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Password Change Section */}
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#FFB800] flex items-center justify-center">
                  <Lock className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Change Password</h2>
                  <p className="text-gray-400 text-sm mt-1">Ensure your account is using a secure password</p>
                </div>
              </div>

              <form onSubmit={handleSubmit(handlePasswordChange)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    {...register('currentPassword', { required: 'Current password is required' })}
                    className="w-full px-3 py-2 bg-[#2A2826] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#FFB800]"
                  />
                  {errors.currentPassword && (
                    <p className="mt-1 text-sm text-red-500">{errors.currentPassword.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    {...register('newPassword', { 
                      required: 'New password is required',
                      minLength: {
                        value: 8,
                        message: 'Password must be at least 8 characters'
                      }
                    })}
                    className="w-full px-3 py-2 bg-[#2A2826] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#FFB800]"
                  />
                  {errors.newPassword && (
                    <p className="mt-1 text-sm text-red-500">{errors.newPassword.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: value => value === newPassword || 'Passwords do not match'
                    })}
                    className="w-full px-3 py-2 bg-[#2A2826] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#FFB800]"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="px-4 py-2 bg-[#FFB800] hover:bg-[#FFA500] text-black font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50"
                  >
                    {isChangingPassword ? 'Changing Password...' : 'Change Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
