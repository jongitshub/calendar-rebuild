import BookingCalendar from "../components/BookingCalendar";
import ErrorBoundary from "../components/ErrorBoundary"; // Import ErrorBoundary

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Book an Appointment
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Select a date and time to schedule your booking.
        </p>

        {/* Wrap the BookingCalendar in ErrorBoundary */}
        <ErrorBoundary>
          <BookingCalendar />
        </ErrorBoundary>
      </div>
    </div>
  );
}
