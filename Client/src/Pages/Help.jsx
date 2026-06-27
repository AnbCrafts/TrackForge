import { 
  HelpCircle, Info, CheckCircle, Lightbulb, Search, LogIn, ArrowRight, 
  WavesLadder, InfoIcon, Book 
} from "lucide-react";
import { assets } from "../assets/assets";
import Gallery from "../Components/Gallery";
import { useState, useMemo } from "react";
import FAQSection from "../Components/FAQSection";
import AIMail from "../Components/AIMail";

const imageObjects = [
  { title: 'Intro', image: assets.intro },
  { title: 'Preview', image: assets.preview },
  { title: 'Bug', image: assets.bug },
  { title: 'Teams', image: assets.teams },
  { title: 'Profile', image: assets.profile },
];

const helpQuestions = [
  {
    id: "create-project",
    question: "How to create a project?",
    answer:
      "Go to the Projects section and click on the 'Create Project' button. Enter your project name, description, and assign a team.",
    images: ["/help/create-project-step1.png", "/help/create-project-step2.png"],
  },
  {
    id: "invite-members",
    question: "How to invite team members?",
    answer:
      "Navigate to the Team tab inside your project. Click 'Invite Member', enter their email address, and assign a role.",
    images: ["/help/invite-member.png"],
  },
  {
    id: "create-assign-ticket",
    question: "How to create and assign a ticket?",
    answer:
      "Open your project → Tickets → 'New Ticket'. Provide title, description, priority & assign it.",
    images: ["/help/create-ticket.png", "/help/assign-ticket.png"],
  },
  {
    id: "track-progress",
    question: "How to track progress?",
    answer:
      "Use ticket statuses + dashboard insights + activity logs to monitor progress.",
    images: ["/help/dashboard-progress.png"],
  },
  {
    id: "reset-password",
    question: "How to reset my password?",
    answer:
      "Click 'Forgot Password' on login page → Enter email → Reset link arrives.",
    images: ["/help/reset-password.png"],
  },
  {
    id: "view-analytics",
    question: "How to view analytics?",
    answer:
      "Open Analytics tab → View charts, trends, distribution & performance metrics.",
    images: ["/help/project-analytics.png"],
  },
];

export default function Help() {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [isMailModalOpen, setIsMailModalOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!query.trim()) return helpQuestions;
    const q = query.toLowerCase();
    return helpQuestions.filter(
      (h) => h.question.toLowerCase().includes(q) || h.answer.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="max-w-full mx-auto px-6 py-10 space-y-12 text-gray-900 bg-white">

      {/* HERO SECTION */}
      <div className="relative h-[50vh] rounded-xl overflow-hidden shadow-md">
        <img
          src={assets.help_bg}
          alt="help background"
          className="absolute inset-0 w-full h-full object-cover brightness-[.65]"
        />

        <div className="relative z-10 h-full flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-white/40 backdrop-blur-lg rounded-xl p-8 text-center shadow-xl border border-white/50">
            <img src={assets.confused} alt="help" className="w-24 h-24 mx-auto mb-4" />

            <h1 className="text-3xl sm:text-4xl font-semibold text-gray-50">
              How can we help you?
            </h1>

            <p className="text-sm text-gray-100 mt-2 mb-6">
              Search in-depth guides, FAQs and tutorials.
            </p>

            <div className="max-w-2xl mx-auto flex gap-3">
              {/* Search bar */}
              <label className="relative flex-1">
                <input
                  type="search"
                  placeholder="Search help articles..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full py-3 pl-4 pr-12 rounded-md border border-white/40 bg-white/90 
                            text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-300 
                            focus:outline-none shadow-sm"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded 
                            bg-purple-600 hover:bg-purple-700 text-white shadow"
                >
                  <Search className="w-5 h-5" />
                </button>
              </label>

              <button
                onClick={() => {
                  setQuery("");
                  setExpanded(null);
                }}
                className="px-4 py-3 rounded-md bg-white/30 text-white hover:bg-white/40 shadow"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK CARDS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CARD 1 */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <LogIn className="w-6 h-6 text-purple-500" />
            <div>
              <h3 className="text-lg font-medium">Register & Login</h3>
              <p className="text-sm text-gray-600">Quick, simple and secure.</p>
            </div>
          </div>

          <ul className="mt-4 text-gray-700 text-sm space-y-1">
            <li>• Email sign-up</li>
            <li>• Secure login</li>
            <li>• Password reset</li>
          </ul>

          <button
            onClick={() =>
              document.getElementById("create-account")?.scrollIntoView({ behavior: "smooth" })
            }
            className="mt-4 px-3 py-2 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700 transition shadow-sm"
          >
            Get Started
          </button>
        </div>

        {/* CARD 2 */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <Lightbulb className="w-6 h-6 text-yellow-500" />
            <div>
              <h3 className="text-lg font-medium">How to Use</h3>
              <p className="text-sm text-gray-600">Basic onboarding flow.</p>
            </div>
          </div>

          <ol className="mt-4 list-decimal list-inside text-gray-700 text-sm space-y-1">
            <li>Create workspace</li>
            <li>Add team members</li>
            <li>Create & assign tickets</li>
          </ol>
        </div>

        {/* CARD 3 */}
        <div classname="bg-white rounded-xl shadow-sm p-6 border border-purple-600">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-purple-500" />
            <div>
              <h3 className="text-lg font-medium">Features & Support</h3>
              <p className="text-sm text-gray-600">TrackForge essentials.</p>
            </div>
          </div>

          <ul className="mt-4 text-sm text-gray-700 space-y-1">
            <li>Tickets & comments</li>
            <li>Files & analytics</li>
            <li>Role management</li>
          </ul>
        </div>
      </section>

      {/* FAQ + GALLERY */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FAQ LIST */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">FAQs</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((q,i) => {
              const open = expanded === q.id;
              return (
                <div
                  key={q.id}
                  className={`${i%2===0?"bg-white border border-gray-200 text-gray-600 ":"bg-purple-600 border border-gray-200 text-white/80"} rounded-lg p-4 shadow-sm 
                  transition ${open ? "ring-1 ring-purple-300" : "hover:shadow-md"}`}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-800">{q.question}</h3>
                      <p className={`mt-2 text-sm ${open ? "" : "line-clamp-3"}`}>
                        {q.answer}
                      </p>
                    </div>

                    <button
                      onClick={() => setExpanded(open ? null : q.id)}
                      className="p-2 rounded bg-purple-50 hover:bg-purple-100 border border-purple-200"
                    >
                      <InfoIcon className="w-5 h-5 text-purple-600" />
                    </button>
                  </div>

                  {/* IMAGES */}
                  {open && q.images?.length > 0 && (
                    <div className="mt-3 border-t pt-3">
                      <div className="flex gap-3">
                        {q.images.map((src, i) => (
                          <img
                            key={i}
                            src={src}
                            className="w-28 h-20 object-cover rounded border border-gray-300"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {filtered.length === 0 && (
              <p className="text-center text-gray-600 py-4">
                No results for <strong>{query}</strong>.
              </p>
            )}
          </div>
        </div>

        {/* GALLERY & QUICK LINKS */}
        <aside className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">Preview Gallery</h3>
            <Gallery items={imageObjects} activeIndex={galleryIndex} setActiveIndex={setGalleryIndex} />
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">Quick Guides</h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-purple-500" /> Create Project
              </li>
              <li className="flex items-center gap-2">
                <WavesLadder className="w-4 h-4 text-blue-500" /> Invite Members
              </li>
              <li className="flex items-center gap-2">
                <Book className="w-4 h-4 text-teal-500" /> Analytics Guide
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <h3 className="text-lg font-semibold mb-2">Need More Help?</h3>
            <p className="text-sm text-gray-600 mb-3">Our support team is here for you.</p>
            <button
              onClick={() => setIsMailModalOpen(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition cursor-pointer"
            >
              Contact Support
            </button>
          </div>
        </aside>
      </section>

      {/* REGISTER / LOGIN WALKTHROUGH */}
      <section id="create-account" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="md:flex md:items-center md:gap-6">
          <div className="md:flex-1">
            <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2">
              <LogIn className="text-purple-500" />
              Register & Login
            </h2>

            <p className="text-gray-700 mb-4">
              Create an account and start managing projects instantly.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* LEFT */}
              <div className="p-4 bg-gray-50 rounded border border-gray-200">
                <h4 className="font-medium mb-2">Why register?</h4>
                <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                  <li>Role-based access</li>
                  <li>Secure sessions</li>
                  <li>Password recovery</li>
                </ul>
              </div>

              {/* RIGHT */}
              <div className="p-4 bg-gray-50 rounded border border-gray-200">
                <h4 className="font-medium mb-2">Quick steps</h4>
                <ol className="text-sm text-gray-600 list-decimal list-inside space-y-1">
                  <li>Open sign-up form</li>
                  <li>Fill details</li>
                  <li>Verify email</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="md:w-64 mt-6 md:mt-0 mx-auto">
            <img src={assets.register} className="rounded shadow border border-gray-200 w-56 h-40 object-cover" />
          </div>
        </div>

        {/* LOGIN STEPS */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
            Steps to login <WavesLadder className="text-blue-500" />
          </h3>

          <div className="flex items-center gap-4 flex-wrap">
            <img src={assets.dash} className="w-36 rounded border border-gray-200" />
            <ArrowRight className="text-purple-500" />
            <img src={assets.login} className="w-36 rounded border border-gray-200" />
            <ArrowRight className="text-purple-500" />
            <img src={assets.intro} className="w-36 rounded border border-gray-200" />
          </div>
        </div>
      </section>

      {/* SHOWCASE */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="md:flex md:gap-6">
          <div className="md:flex-1">
            <h2 className="text-2xl font-semibold text-purple-700 mb-3">
              Easy dashboard & profile management
            </h2>
            <p className="text-gray-700 mb-4">
              Manage tasks, track bugs and collaborate effortlessly.
            </p>

            <div className="flex gap-3 flex-wrap">
              <img src={assets.dashboard} className="w-40 rounded border border-gray-200" />
              <img src={assets.profile2} className="w-40 rounded border border-gray-200" />
              <img src={assets.intro} className="w-40 rounded border border-gray-200" />
            </div>
          </div>

          <div className="md:w-96 mt-6 md:mt-0 mx-auto">
            <img src={assets.dash_bg} className="rounded shadow border border-gray-200" />
          </div>
        </div>
      </section>

      {/* FULL FAQ SECTION */}
      <FAQSection />

      {/* AI Mail Modal */}
      <AIMail isOpen={isMailModalOpen} onClose={() => setIsMailModalOpen(false)} />
     
    </div>
  );
}
