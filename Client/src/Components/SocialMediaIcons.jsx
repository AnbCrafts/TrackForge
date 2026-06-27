import React, { useContext } from 'react';
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";
import { Facebook, Twitter, Instagram, Linkedin, Github } from 'lucide-react';

const SocialIcons = () => {
  const { serverURL } = useContext(TrackForgeContextAPI);
  const iconList = [
    {
      name: "GitHub",
      icon: Github,
      onClick: () => {
        const apiBase = serverURL.replace("/api", "");
        window.location.href = `${apiBase}/api/authorize/github`;
      },
      color: "hover:text-black",
      type: "button",
    },
    {
      name: "Facebook",
      icon: Facebook,
      url: "https://facebook.com",
      color: "hover:text-blue-600",
    },
    {
      name: "Twitter",
      icon: Twitter,
      url: "https://twitter.com",
      color: "hover:text-sky-500",
    },
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://instagram.com",
      color: "hover:text-pink-500",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: "https://linkedin.com",
      color: "hover:text-blue-700",
    },
  ];

  return (
    <div className="flex gap-5 justify-center mt-6">
      {iconList.map((item, index) => {
        const Icon = item.icon;

        return item.type === "button" ? (
          <button
            key={index}
            onClick={item.onClick}
            className={`text-gray-600 transition transform hover:scale-110 ${item.color}`}
            aria-label={item.name}
          >
            <Icon size={24} />
          </button>
        ) : (
          <a
            key={index}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.name}
            className={`text-gray-600 transition transform hover:scale-110 ${item.color}`}
          >
            <Icon size={24} />
          </a>
        );
      })}
    </div>
  );
};

export default SocialIcons;
