import { useRouteError } from "react-router-dom";

function ErrorPage() {
  const error = useRouteError();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Oops!</h1>
        <p className="text-gray-600 mb-4">Sorry, an unexpected error has occurred.</p>
        <p className="text-gray-500 italic">
          {error.statusText || error.message}
        </p>
      </div>
    </div>
  );
}
export default ErrorPage;