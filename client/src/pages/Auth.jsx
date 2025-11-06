import {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import { jwtDecode } from 'jwt-decode'

export default function Auth({setAuthorId}) {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState("");

    const API_BASE_URL = 'https://campus-connect-98bf.onrender.com';

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const uploadAvatar = async (file) => {
        try {
            const imageType = file.type.split('/')[1];
            const authToken = localStorage.getItem('authToken');
            const signedUrlResponse = await fetch(`${API_BASE_URL}/avatar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({imageType})
            });

            const signedUrlData = await signedUrlResponse.json();
            if (!signedUrlResponse.ok) throw new Error(signedUrlData.error || 'Failed to get upload URL');

            const {url: signedUrl, filename} = signedUrlData;

            await fetch(signedUrl, {
                method: 'PUT',
                headers: {'Content-Type': file.type},
                body: file
            });

            return filename;
        } catch (error) {
            console.error('Avatar upload failed:', error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            if (isLogin) {
                const response = await fetch(`${API_BASE_URL}/login`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        username: formData.username,
                        password: formData.password
                    })
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Login failed');

                localStorage.clear();
                localStorage.setItem('authToken', data.token);

                const user = jwtDecode(token);
                console.log(user);
                setAuthorId(user?.id);

                setSuccess('Login successful!');

                setFormData({
                    fullName: '',
                    username: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
                });

                navigate('/');
            } else {
                if (formData.password !== formData.confirmPassword) throw new Error('Passwords do not match');
                if (formData.password.length < 8) throw new Error('Password must be at least 8 characters long');

                const body = {
                    name: formData.fullName,
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                };

                if (imageFile) {
                    const imageUrl = await uploadAvatar(imageFile);
                    body.image_url = imageUrl;
                }

                const response = await fetch(`${API_BASE_URL}/signup`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(body)
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Auth failed');

                setSuccess('Account created successfully! Please sign in.');
                setIsLogin(true);

                setFormData({
                    fullName: '',
                    username: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
                });
                setImageFile(null);
                setImagePreview('');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setToken(localStorage.getItem("authToken"));

        if (token) {
            navigate('/');
        }
    }, [navigate]);

    useEffect(() => {
        console.log("token: "+token);
    }, [token]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        {isLogin ? 'Welcome back' : 'Create your account'}
                    </h3>
                    <p className="text-gray-500 mb-6">
                        {isLogin ? 'Enter your credentials to sign in' : 'Enter your details below to create your account'}
                    </p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                            {success}
                        </div>
                    )}

                    <div className="space-y-4">
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    placeholder="Full Name"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                placeholder="Username"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition"
                            />
                        </div>

                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="m@example.com"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition"
                            />
                        </div>

                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition"
                                />
                            </div>
                        )}


                        {!isLogin && (
                            <div className="pt-4 border-t border-gray-200">
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Upload Profile Picture (optional)
                                </label>
                                <div className="flex flex-col items-center gap-3">
                                    <div
                                        className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-gray-200 shadow-sm hover:shadow-md transition">
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div
                                                className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                                <svg
                                                    className="w-10 h-10"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 4v16m8-8H4"
                                                    />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    <label className="cursor-pointer">
                    <span
                        className="px-4 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-900 transition font-medium">
                      Choose Image
                    </span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full mt-6 bg-gray-800 text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
                        </button>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600 text-sm">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    setError('');
                                    setSuccess('');
                                    setFormData({
                                        fullName: '',
                                        username: '',
                                        email: '',
                                        password: '',
                                        confirmPassword: ''
                                    });
                                    setImageFile(null);
                                    setImagePreview('');
                                }}
                                className="text-gray-800 font-medium hover:underline"
                            >
                                {isLogin ? 'Sign up' : 'Sign in'}
                            </button>
                        </p>
                    </div>

                    <div className="mt-6 text-center text-xs text-gray-500">
                        By continuing, you agree to our{" "}
                        <span className="underline cursor-pointer hover:text-gray-700">
              Terms of Service
            </span>{" "}
                        and{" "}
                        <span className="underline cursor-pointer hover:text-gray-700">
              Privacy Policy
            </span>
                    </div>
                </div>


            </div>
        </div>
    );
}
