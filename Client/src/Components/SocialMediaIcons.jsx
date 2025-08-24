import { Facebook, Twitter, Instagram, Linkedin, Github } from 'lucide-react';

const SocialIcons = () => (
  <div className="flex gap-5 justify-center mt-6">
    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition">
      <Facebook size={24} />
    </a>
    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-sky-500 transition">
      <Twitter size={24} />
    </a>
    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-pink-500 transition">
      <Instagram size={24} />
    </a>
    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-700 transition">
      <Linkedin size={24} />
    </a>
    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black transition">
      <Github size={24} />
    </a>
  </div>
);

export default SocialIcons;
