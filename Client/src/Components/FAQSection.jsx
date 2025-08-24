import { HelpCircle, MessageSquare, Send, PhoneCall, Mail,Users } from "lucide-react";

const faqs = [
  {
    question: "How do I create a new project?",
    answer: "Navigate to the dashboard and click on 'Create Project'. Fill in the details, assign team members, and you're set!",
    icon: HelpCircle,
  },
  {
    question: "Can I track team activity in real-time?",
    answer: "Absolutely! TrackForge provides real-time activity feeds, notifications, and progress updates for all your projects.",
    icon: MessageSquare,
  },
  {
    question: "Is there a limit to team members per project?",
    answer: "No limits! You can add as many team members as needed to collaborate efficiently on your projects.",
    icon: Users,
  },
];

const FAQSection = () => {
  return (
    <section className="py-20 px-6 bg-gray-100">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* FAQ Cards */}
        <div>
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg flex items-start gap-4 hover:shadow-xl transition">
                <div className="text-indigo-600 text-3xl">
                  <faq.icon />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">{faq.question}</h4>
                  <p className="text-gray-600 text-sm mt-2">{faq.answer}</p>
                </div>
              </div> 
            ))}
          </div>
        </div>

        {/* Query Form */}
        <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col justify-center">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">Still have questions?</h3>
          <p className="text-gray-600 mb-6">Send us your query and our support team will get back to you shortly.</p>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <textarea
              placeholder="Type your question here..."
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white p-3 rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-700 transition"
            >
              <Send size={18} />
              Submit Query
            </button>
          </form>

          {/* Contact Info */}
          <div className="mt-8 text-gray-600 space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <PhoneCall size={18} className="text-indigo-500" />
              +91 98765 43210
            </div>
            <div className="flex items-center gap-2">
              <Mail size={18} className="text-indigo-500" />
              support@trackforge.com
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
