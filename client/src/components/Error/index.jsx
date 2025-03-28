import { Link } from "react-router-dom";

function NotFound(){
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <p className="text-2xl text-gray-700 mt-4">Oops! Page Not Found</p>
      <Link to="/" className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700">
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;
