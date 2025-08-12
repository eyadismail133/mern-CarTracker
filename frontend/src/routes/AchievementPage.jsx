import topServiceImg from "../images/top service.png";
import serviced1000Img from "../images/1000.jpeg";
import ecoFriendlyImg from "../images/eco.jpeg";

const achievements = [
  {
    title: "Top Service Center 2025",
    img: topServiceImg,
    desc: "Recognized for outstanding customer satisfaction and service quality in 2025.",
  },
  {
    title: "1000+ Vehicles Serviced",
    img: serviced1000Img,
    desc: "Milestone reached for vehicles maintained and repaired.",
  },
  {
    title: "Eco-Friendly Garage",
    img: ecoFriendlyImg,
    desc: "Awarded for implementing green practices and reducing environmental impact.",
  },
];

const AchievementPage = () => (
  <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-gray-900 to-indigo-900 text-gray-100 overflow-hidden">
    <div className="flex items-center justify-center h-full w-full overflow-auto">
      <div className="max-w-4xl mx-auto p-10 bg-gray-900 bg-opacity-50 backdrop-blur-md rounded-3xl shadow-2xl">
        <h1 className="text-4xl font-extrabold mb-8 text-emerald-300 text-center">
          Achievements
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {achievements.map((a) => (
            <div
              key={a.title}
              className="bg-gray-800 bg-opacity-70 rounded-2xl shadow-lg p-6 flex flex-col items-center"
            >
              <img
                src={a.img}
                alt={a.title}
                className="w-32 h-32 object-cover rounded-full mb-4 border-4 border-emerald-400 shadow"
              />
              <h2 className="text-xl font-bold text-emerald-200 mb-2 text-center">
                {a.title}
              </h2>
              <p className="text-gray-300 text-center">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default AchievementPage;
