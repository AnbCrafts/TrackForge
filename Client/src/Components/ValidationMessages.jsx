import { Key } from "lucide-react";
import React from "react";

const validationMessages = {
  username: [
    "Username must be lowercase and contain no special characters.",
    "Username is required.",
  ],
  firstName: [
    "First name must be at least 3 characters long.",
    "First name is required.",
  ],
  lastName: [
    "Last name must be at least 3 characters long.",
    "Last name is required.",
  ],
  email: ["Enter a valid email address.", "Email is required."],
  password: [
    "Password must be at least 8 characters.",
    "Password must include at least 3 numbers.",
    "Password must include at least 4 letters.",
    "Password must contain at least 1 special character.",
    "Password is required.",
  ],
  role: [
    "Role must be one of: Owner, Admin, Tester, Developer, Debugger.",
    "Role is required.",
  ],
};

export default function ValidationMessagesDisplay() {
  return (
    <div className="w-full max-w-4xl mx-auto p-10 rounded-2xl
                    bg-[#111318]/80 backdrop-blur-xl 
                    card-neon-animated
                    text-white">

      {/* Heading */}
      <h1 className="text-3xl font-bold text-center bg-gradient-to-r 
                     from-purple-400 to-pink-500 bg-clip-text text-transparent pb-4
                     border-b border-[#2d0a39]">
        Field Validations
      </h1>

      {/* Content */}
      <div className="mt-8 space-y-10">
        {Object.entries(validationMessages).map(([field, messages]) => (
          <div key={field}>

            {/* Field Title */}
            <h2 className="text-2xl font-semibold 
                           bg-gradient-to-r from-purple-300 to-pink-300 
                           bg-clip-text text-transparent capitalize mb-3">
              {field}
            </h2>

            {/* Rules List */}
            <div className="space-y-3 pl-2">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl
                             bg-[#0A0A0C] border border-[#2d0a39]
                             hover:border-pink-500 
                             transition-all duration-300
                             shadow-[0_0_20px_rgba(200,0,255,0.15)]
                             hover:shadow-[0_0_35px_rgba(255,0,200,0.4)]
                             text-gray-300 text-sm"
                >
                  {/* Neon Icon */}
                  <Key className="h-6 w-6 p-1 rounded-lg
                                  bg-gradient-to-r from-purple-500 to-pink-500
                                  shadow-[0_0_10px_rgba(255,0,200,0.6)]
                                  text-white flex-shrink-0" />

                  <span className="leading-relaxed">{msg}</span>
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
