import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Contact() {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission here
        console.log(formData);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="w-full bg-[#1e3a8a] py-16 px-4 sm:px-6 lg:px-8" id="contact">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-[#c8c2fd] mb-4">{t('Contact')}</h2>
                    <p className="text-[#c8c2fd]/80">{t('contactDescription')}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Contact Information */}
                    <div className="space-y-6">
                        <div className="flex items-start space-x-4">
                            <div className="bg-[#6D28D9] p-3 rounded-lg">
                                <Mail className="text-[#c8c2fd] h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-[#c8c2fd] font-semibold">{t('Email')}</h3>
                                <p className="text-[#c8c2fd]/80">contact@example.com</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="bg-[#6D28D9] p-3 rounded-lg">
                                <Phone className="text-[#c8c2fd] h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-[#c8c2fd] font-semibold">{t('Phone')}</h3>
                                <p className="text-[#c8c2fd]/80">+1 234 567 890</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="bg-[#6D28D9] p-3 rounded-lg">
                                <MapPin className="text-[#c8c2fd] h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-[#c8c2fd] font-semibold">{t('Address')}</h3>
                                <p className="text-[#c8c2fd]/80">123 Business Street, City, Country</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-[#c8c2fd] mb-2">{t('Name')}</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg bg-[#1e3a8a] border border-[#6D28D9] text-[#c8c2fd] focus:outline-none focus:ring-2 focus:ring-[#6D28D9]"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-[#c8c2fd] mb-2">{t('Email')}</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg bg-[#1e3a8a] border border-[#6D28D9] text-[#c8c2fd] focus:outline-none focus:ring-2 focus:ring-[#6D28D9]"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="subject" className="block text-[#c8c2fd] mb-2">{t('Subject')}</label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg bg-[#1e3a8a] border border-[#6D28D9] text-[#c8c2fd] focus:outline-none focus:ring-2 focus:ring-[#6D28D9]"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="message" className="block text-[#c8c2fd] mb-2">{t('Message')}</label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows="4"
                                className="w-full px-4 py-2 rounded-lg bg-[#1e3a8a] border border-[#6D28D9] text-[#c8c2fd] focus:outline-none focus:ring-2 focus:ring-[#6D28D9]"
                                required
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#6D28D9] text-[#c8c2fd] py-3 px-6 rounded-lg hover:bg-[#5B21B6] transition duration-300 flex items-center justify-center space-x-2"
                        >
                            <Send className="h-5 w-5" />
                            <span>{t('Send Message')}</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
} 