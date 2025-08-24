import { Key } from 'lucide-react';
import React from 'react';

const fieldValidationMessages = {
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
  email: [
    "Enter a valid email address.",
    "Email is required.",
  ],
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

const ValidationMessagesDisplay = () => {
  return (
    <div className="w-full bg-gray-100 p-6 rounded-xl shadow-2xl border-gray-300">
        <h1 className='text-2xl text-center font-semibold text-gray-700 pb-1 border-b border-gray-200'>Field validations</h1>
      {Object.entries(fieldValidationMessages).map(([field, messages], index) => (
        <div key={index} className="mb-6">
          <h1 className="text-2xl font-semibold text-green-500 capitalize mb-2">{field}</h1>
          {messages.map((msg, idx) => (
            <p key={idx} className="text-sm font-semibold text-gray-600 flex items-center justify-start gap-2 pb-1.5">
                <Key className='h-5 w-5 p-0.5 border border-gray-300 rounded shadow-2xl'/>
                {msg}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ValidationMessagesDisplay;
