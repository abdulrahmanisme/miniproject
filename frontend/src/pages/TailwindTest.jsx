export default function TailwindTest() {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-4xl font-bold text-blue-600">Tailwind CSS Test</h1>
      
      <div className="bg-red-500 text-white p-4 rounded">
        Red background - if you see RED, Tailwind is working!
      </div>
      
      <div className="bg-green-500 text-white p-4 rounded">
        Green background - if you see GREEN, Tailwind is working!
      </div>
      
      <div className="bg-yellow-500 text-black p-4 rounded">
        Yellow background - if you see YELLOW, Tailwind is working!
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-purple-600 h-20 rounded"></div>
        <div className="bg-pink-600 h-20 rounded"></div>
        <div className="bg-indigo-600 h-20 rounded"></div>
      </div>
      
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg">
        Hover Me - Button Test
      </button>
    </div>
  );
}
