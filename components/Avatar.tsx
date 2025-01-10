import React, {useState} from 'react'

const Avatar = () => {
    const [avatar, setAvatar] = useState<string | null>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove the avatar
  const handleRemoveAvatar = () => {
    setAvatar(null);
  };



  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        <div className="w-24 h-24 rounded-full border-4 border-gray-300 overflow-hidden">
          {avatar ? (
            <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-500">
              <span>No Avatar</span>
            </div>
          )}
        </div>
        <label
          htmlFor="avatar-upload"
          className="absolute bottom-0 right-0 bg-button-gradient-metallic text-white p-2 rounded-full cursor-pointer"
        >
          <span className="text-sm">Upload</span>
        </label>
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      {avatar && (
        <button
          onClick={handleRemoveAvatar}
          className="mt-4 bg-red-500 text-white p-2 rounded-full"
        >
          Remove Avatar
        </button>
      )}
    </div>
  )
}

export default Avatar