import { assets } from "../assets/assets";

const projects = [
  {
    title: "E-Commerce Redesign",
    image: assets.project2,
  },
  {
    title: "Mobile Bug Tracker",
    image: assets.project4,
  },
  {
    title: "AI Analytics Dashboard",
    image: assets.project3,
  },
  {
    title: "Team Wiki System",
    image: assets.project4,
  },
  {
    title: "Real-time Chat",
    image: assets.project4,
  },
];

const ProjectShowcase = () => {
  return (
    <div className="w-full overflow-hidden py-10">
      <div className="flex scroll-gallery w-max gap-10">
        {[...projects, ...projects].map(
          (
            project,
            index // Duplicating for seamless loop
          ) => (
            <div
              key={index}
              className="project-card w-xl h-[400px] bg-gray-700 rounded-xl shadow-xl overflow-hidden flex-shrink-0 transition-transform duration-300 cursor-pointer"
            >
                <h1 className="text-center py-3 text-2xl bg-gray-900 text-white">{project.title}</h1>
              <div className="w-lg mx-auto h-[350px] ">
                <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-contain"
              />
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ProjectShowcase;
