// src/data/testimonialsData.js
import { User, Users, Code, Zap, Heart } from "lucide-react";

export const testimonialsData = [
  {
    username: "Aanya Sharma",
    role: "Frontend Engineer @ NeonWorks",
    feedback:
      "TrackForge removed the noise from our sprint process — bug triage went from hours to minutes. The UI is fast and focused.",
    rating: 5,
    explanation: "We cut our bug cycle time by 42% in the first month.",
    icon: <User />,
  },
  {
    username: "Rahul Mehta",
    role: "QA Lead @ PixelStream",
    feedback:
      "Love the real-time activity feeds and the easy project ownership. Creating reproducible bug reports is now painless.",
    rating: 5,
    explanation: "QA -> Dev handoffs are much smoother; fewer reopen tickets.",
    icon: <Users />,
  },
  {
    username: "Sofia Alvarez",
    role: "Product Manager @ Skybolt",
    feedback:
      "The analytics helped us spot recurring regressions and prioritize features more confidently.",
    rating: 4,
    explanation: "Useful insights — wish there were a couple more export options, but overall excellent.",
    icon: <Zap />,
  },
  {
    username: "Dev Gupta",
    role: "Backend Engineer @ CoreStack",
    feedback:
      "Integration with our CI and the clarity of the ticket details saved me so much time during releases.",
    rating: 5,
    explanation: "Saved multiple hours per release; developer experience is superb.",
    icon: <Code />,
  },
  {
    username: "Maya Kapoor",
    role: "Team Lead @ Flowbyte",
    feedback:
      "Everyone on the team actually uses it — which is rare. The UI is delightful and the collaboration features shine.",
    rating: 4,
    explanation: "Great onboarding and daily usage. The chat assistant is a big plus.",
    icon: <Heart />,
  },
];

export default testimonialsData;
