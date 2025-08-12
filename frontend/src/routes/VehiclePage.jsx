import tesla from "../images/tesla.jpeg";
import toyota from "../images/toyota camry.jpeg";
import ford550 from "../images/ford 550.jpeg";

const vehicles = [
  {
    name: "Toyota Camry",
    img: toyota,
    desc: "Reliable sedan, serviced regularly.",
  },
  {
    name: "Ford F-550",
    img: ford550,
    desc: "Workhorse truck, used for heavy-duty jobs.",
  },
  {
    name: "Tesla Model 3",
    img: tesla,
    desc: "Electric vehicle, eco-friendly and modern.",
  },
];

const VehiclePage = () => (
  <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-gray-900 to-indigo-900 text-gray-100 overflow-hidden">
    <div className="flex items-center justify-center h-full w-full overflow-auto">
      <div className="max-w-4xl mx-auto p-10 bg-gray-900 bg-opacity-50 backdrop-blur-md rounded-3xl shadow-2xl">
        <h1 className="text-4xl font-extrabold mb-8 text-emerald-300 text-center">
          Vehicles
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {vehicles.map((v) => (
            <div
              key={v.name}
              className="bg-gray-800 bg-opacity-70 rounded-2xl shadow-lg p-6 flex flex-col items-center"
            >
              <img
                src={v.img}
                alt={v.name}
                className="w-32 h-32 object-cover rounded-full mb-4 border-4 border-emerald-400 shadow"
              />
              <h2 className="text-xl font-bold text-emerald-200 mb-2 text-center">
                {v.name}
              </h2>
              <p className="text-gray-300 text-center">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default VehiclePage;
