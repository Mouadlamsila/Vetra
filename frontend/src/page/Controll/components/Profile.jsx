import axios from "axios";
import { Lock, MailIcon, PenBox, PenIcon, SaveAll, Store, Eye, EyeOff, Camera } from "lucide-react";
import { useEffect, useState } from "react";
import ShinyButton from "../../../blocks/TextAnimations/ShinyButton/ShinyButton";
import { useTranslation } from "react-i18next";

export default function Profile() {
    const { t } = useTranslation();
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(true);
    const language = localStorage.getItem("lang");
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        oldPassword: "",
        photo: null
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordRequirements, setPasswordRequirements] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
    });
    const [previewUrl, setPreviewUrl] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await axios.get("http://localhost:1337/api/users/me?populate=photo", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            setUser(response.data);
            setFormData({
                username: response.data.username,
                email: response.data.email,
                password: "",
                confirmPassword: "",
                oldPassword: "",
                photo: null
            });
            if (response.data.photo) {
                setPreviewUrl(`http://localhost:1337${response.data.photo.url}`);
            } else {
                setPreviewUrl(`https://api.dicebear.com/7.x/initials/svg?seed=${response.data.username}&backgroundColor=c8c2fd`);
            }
        } catch (err) {
            setError("Échec de la récupération des données utilisateur");
            console.error(err);
        }
    };

    console.log(user);
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError(t('dashboard.invalidFile'));
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                setError(t('dashboard.fileTooLarge'));
                return;
            }

            const preview = URL.createObjectURL(file);
            setPreviewUrl(preview);
            
            setFormData(prev => ({
                ...prev,
                photo: file
            }));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'password') {
            checkPasswordRequirements(value);
        }
    };

    const checkPasswordRequirements = (password) => {
        setPasswordRequirements({
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        });
    };

    const verifyOldPassword = async () => {
        try {
            await axios.post(
                "http://localhost:1337/api/auth/local",
                {
                    identifier: user.email,
                    password: formData.oldPassword
                }
            );
            return true;
        } catch {
            return false;
        }
    };

    const validateForm = async () => {
        if (!formData.oldPassword) {
            setError(t('dashboard.oldPasswordRequired'));
            return false;
        }

        if (formData.password) {
            const isOldPasswordValid = await verifyOldPassword();
            if (!isOldPasswordValid) {
                setError(t('dashboard.incorrectOldPassword'));
                return false;
            }

            if (formData.password !== formData.confirmPassword) {
                setError(t('dashboard.passwordsDontMatch'));
                return false;
            }

            const requirements = Object.values(passwordRequirements);
            if (!requirements.every(req => req)) {
                setError(t('dashboard.passwordRequirementsNotMet'));
                return false;
            }
        }
        return true;
    };

    const handleUpdate = async () => {
        setError("");
        setSuccess("");
        setIsUploading(true);
        
        if (!await validateForm()) {
            setIsUploading(false);
            return;
        }

        try {
            let photoId = null;
            
            // Handle photo upload if a new photo is selected
            if (formData.photo) {
                const uploadFormData = new FormData();
                uploadFormData.append('files', formData.photo);
                
                const uploadResponse = await axios.post(
                    'http://localhost:1337/api/upload',
                    uploadFormData,
                    {
            headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
                
                if (uploadResponse.data && uploadResponse.data[0]) {
                    photoId = uploadResponse.data[0].id;
                    console.log("Uploaded photo ID:", photoId);
                } else {
                    throw new Error(t('dashboard.uploadFailed'));
                }
            }

            // Prepare the update data
            const updateData = {
                username: formData.username,
                email: formData.email
            };

            if (formData.password) {
                updateData.password = formData.password;
            }

            if (photoId) {
                updateData.photo = photoId;
            }

            console.log("Update data:", updateData);

            // Update user data
            const response = await axios.put(
                `http://localhost:1337/api/users/${user.id}`,
                updateData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log("Update response:", response.data);

            if (response.data) {
                // Fetch updated user data with photo
                const updatedUserResponse = await axios.get(
                    "http://localhost:1337/api/users/me?populate=photo",
                    {
                        headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );
                
                console.log("Updated user data:", updatedUserResponse.data);
                
                setUser(updatedUserResponse.data);
                setIsEditing(true);
                setSuccess(t('dashboard.updateSuccess'));
                setFormData(prev => ({
                    ...prev,
                    password: "",
                    confirmPassword: "",
                    oldPassword: "",
                    photo: null
                }));
            } else {
                throw new Error(t('dashboard.updateError'));
            }
        } catch (err) {
            console.error("Update error:", err);
            console.error("Error response:", err.response?.data);
            if (err.response) {
                if (err.response.data?.error?.message) {
                    setError(err.response.data.error.message);
                } else if (err.response.data?.error) {
                    setError(err.response.data.error);
                } else {
                    setError(t('dashboard.updateError'));
                }
            } else if (err.message) {
                setError(err.message);
            } else {
                setError(t('dashboard.unexpectedError'));
            }
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="py-10 px-10">
            <h1 className="text-3xl font-bold">{t('profile.title')}</h1>
            <p className="text-sm text-gray-500">{t('profile.personalInfo')}</p>
            <div className="pt-5 w-auto">
                <p className="py-1 w-30 text-center bg-gray-100 px-2 hover:bg-white rounded-sm text-gray-500 hover:text-black transition-all duration-300 ease-in-out cursor-pointer">
                    {t('profile.personalInfo')}
                </p>
            </div>
            <div className="border mt-5 space-y-4 px-10 py-5 rounded-lg shadow border-[#c8c2fd]">
                <div>
                    <h1 className="text-2xl font-bold">{t('profile.personalInfo')}</h1>
                    <p className="text-sm text-gray-500">{t('profile.updateInfo')}</p>
                </div>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                        {success}
                    </div>
                )}
                <div className="flex gap-10 items-center">
                    <div className="relative group">
                        <div className="w-20 h-20 rounded-full overflow-hidden">
                            <img 
                                src={previewUrl} 
                                alt={t('profile.profilePhoto')} 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {!isEditing && (
                            <label 
                                htmlFor="photo-upload"
                                className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                                <Camera className="w-6 h-6 text-white" />
                            </label>
                        )}
                        <input
                            id="photo-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            disabled={isEditing}
                        />
                    </div>
                    <div className="grid w-full grid-cols-2 gap-5">
                        <div className="flex items-center gap-2">
                            <PenIcon className={`w-5 h-5 ${!isEditing ? "text-[#c8c2fd]" : "text-gray-500"}`} />
                            <input
                                type="text"
                                name="username"
                                disabled={isEditing}
                                value={formData.username}
                                onChange={handleInputChange}
                                className={`w-full outline-none px-2 duration-75 transition-all ease-in-out border-[#c8c2fd] ${!isEditing ? "border-b-2" : "border-b-0"}`}
                                placeholder={t('profile.name')}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <MailIcon className={`w-5 h-5 ${!isEditing ? "text-[#c8c2fd]" : "text-gray-500"}`} />
                            <input
                                type="email"
                                name="email"
                                disabled={isEditing}
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`w-full outline-none px-2 duration-75 transition-all ease-in-out border-[#c8c2fd] ${!isEditing ? "border-b-2" : "border-b-0"}`}
                                placeholder={t('profile.email')}
                            />
                        </div>
                        <div className="flex items-center gap-2 relative">
                            <Lock className={`w-5 h-5 ${!isEditing ? "text-[#c8c2fd]" : "text-gray-500"}`} />
                            <input
                                type={showOldPassword ? "text" : "password"}
                                name="oldPassword"
                                disabled={isEditing}
                                value={formData.oldPassword}
                                onChange={handleInputChange}
                                className={`w-full outline-none px-2 duration-75 transition-all ease-in-out border-[#c8c2fd] ${!isEditing ? "border-b-2" : "border-b-0"}`}
                                placeholder={t('profile.oldPassword')}
                            />
                            {!isEditing && (
                                <button
                                    onClick={() => setShowOldPassword(!showOldPassword)}
                                    className={`absolute  text-gray-500 hover:text-[#c8c2fd] ${language === 'ar' ? 'left-2' : 'right-2'}`}
                                >
                                    {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            )}
                        </div>
                        <div className="flex items-center gap-2 relative">
                            <Lock className={`w-5 h-5 ${!isEditing ? "text-[#c8c2fd]" : "text-gray-500"}`} />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                disabled={isEditing}
                                value={formData.password}
                                onChange={handleInputChange}
                                className={`w-full outline-none px-2 duration-75 transition-all ease-in-out border-[#c8c2fd] ${!isEditing ? "border-b-2" : "border-b-0"}`}
                                placeholder={t('profile.newPassword')}
                            />
                            {!isEditing && (
                                <button
                                    onClick={() => setShowPassword(!showPassword)}
                                    className={`absolute  text-gray-500 hover:text-[#c8c2fd] ${language === 'ar' ? 'left-2' : 'right-2'}`}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            )}
                        </div>
                        <div className="flex items-center gap-2 relative">
                            <Lock className={`w-5 h-5 ${!isEditing ? "text-[#c8c2fd]" : "text-gray-500"}`} />
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                disabled={isEditing}
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className={`w-full outline-none px-2 duration-75 transition-all ease-in-out border-[#c8c2fd] ${!isEditing ? "border-b-2" : "border-b-0"}`}
                                placeholder={t('profile.confirmPassword')}
                            />
                            {!isEditing && (
                                <button
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className={`absolute  text-gray-500 hover:text-[#c8c2fd] ${language === 'ar' ? 'left-2' : 'right-2'}`}
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {!isEditing && formData.password && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-sm font-semibold mb-2">{t('profile.passwordRequirements')}:</h3>
                        <ul className="space-y-1 text-sm">
                            <li className={`flex items-center ${passwordRequirements.length ? 'text-green-600' : 'text-gray-500'}`}>
                                <span className="mr-2">{passwordRequirements.length ? '✓' : '•'}</span>
                                {t('profile.minLength')}
                            </li>
                            <li className={`flex items-center ${passwordRequirements.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
                                <span className="mr-2">{passwordRequirements.uppercase ? '✓' : '•'}</span>
                                {t('profile.uppercase')}
                            </li>
                            <li className={`flex items-center ${passwordRequirements.lowercase ? 'text-green-600' : 'text-gray-500'}`}>
                                <span className="mr-2">{passwordRequirements.lowercase ? '✓' : '•'}</span>
                                {t('profile.lowercase')}
                            </li>
                            <li className={`flex items-center ${passwordRequirements.number ? 'text-green-600' : 'text-gray-500'}`}>
                                <span className="mr-2">{passwordRequirements.number ? '✓' : '•'}</span>
                                {t('profile.number')}
                            </li>
                            <li className={`flex items-center ${passwordRequirements.special ? 'text-green-600' : 'text-gray-500'}`}>
                                <span className="mr-2">{passwordRequirements.special ? '✓' : '•'}</span>
                                {t('profile.special')}
                            </li>
                        </ul>
                    </div>
                )}

                {isEditing ? (
                    <div onClick={() => setIsEditing(false)} className="w-full flex select-none justify-end pt-4">
                        <ShinyButton rounded={true} className="w-full sm:w-auto">
                            <p className="text-sm sm:text-base">{t('profile.update')}</p>
                            <PenBox className="w-4 h-4 sm:w-5 sm:h-5" />
                        </ShinyButton>
                    </div>
                ) : (
                    <div onClick={handleUpdate} className="w-full flex select-none justify-end pt-4">
                        <ShinyButton 
                            rounded={true} 
                            className={`w-full sm:w-auto ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isUploading}
                        >
                            <p className="text-sm sm:text-base">
                                {isUploading ? t('profile.uploading') : t('profile.save')}
                            </p>
                            <SaveAll className="w-4 h-4 sm:w-5 sm:h-5" />
                        </ShinyButton>
                    </div>
                )}
            </div>
        </div>
    );
}
