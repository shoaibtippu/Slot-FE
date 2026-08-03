import React, { useRef } from 'react';
import { Camera, X } from 'lucide-react';

interface ProfilePhotoUploadProps {
  photoPreview: string | null;
  onPhotoChange: (file: File | null, previewUrl: string | null) => void;
}

export const ProfilePhotoUpload: React.FC<ProfilePhotoUploadProps> = ({
  photoPreview,
  onPhotoChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size exceeds 2MB limit.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        onPhotoChange(file, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onPhotoChange(null, null);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-700 tracking-wide">
        Profile Photo <span className="text-gray-400 font-normal">(Optional)</span>
      </label>

      <div className="flex items-center gap-3.5">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/jpg"
          className="hidden"
          onChange={handleFileSelect}
        />

        <div
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 group border
            ${photoPreview
              ? 'border-emerald-500 p-0.5'
              : 'border-blue-200 bg-blue-50/70 hover:bg-blue-100/70 text-blue-500'
            }
          `}
        >
          {photoPreview ? (
            <div className="relative w-full h-full rounded-full overflow-hidden">
              <img src={photoPreview} alt="Profile preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-0 right-0 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-xs"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <Camera className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
          )}
        </div>

        <div className="text-xs text-gray-500 leading-tight">
          <p className="font-medium text-gray-700">Click to upload.</p>
          <p className="text-gray-400">JPG, PNG (Max 2MB)</p>
        </div>
      </div>
    </div>
  );
};
