export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
      <p className="text-blue-600 font-bold animate-pulse">Scanning faces...</p>
    </div>
  );
}
