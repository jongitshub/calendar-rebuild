import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Default styles
import axios from "axios";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@radix-ui/react-select";
import "../CalendarStyles.css";


interface Booking {
  date: string;
  time: string;
}

export default function BookingCalendar() {
  const [date, setDate] = useState<Date | null>(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [times] = useState(["10:00", "12:00", "14:00", "16:00"]);
  const [view, setView] = useState<"daily" | "weekly" | "monthly">("daily");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    axios
      .get("https://co7j3fhkii5inljmw2hvvwjinu0abysc.lambda-url.us-east-1.on.aws/")
      .then((res) => setBookings(res.data))
      .catch((error) => console.error("🔥 Fetch bookings failed:", error));
  }, []);

  const isBooked = (date: string, time: string) =>
    bookings.some((b) => b.date === date && b.time === time);

  const filterBookings = () => {
    if (!date) return [];

    const formattedDate = date.toISOString().split("T")[0];

    if (view === "daily") {
      return bookings.filter((b) => b.date === formattedDate);
    } else if (view === "weekly") {
      const startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - date.getDay());

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      return bookings.filter((b) => {
        const bookingDate = new Date(b.date);
        return bookingDate >= startOfWeek && bookingDate <= endOfWeek;
      });
    } else if (view === "monthly") {
      const month = date.getMonth();
      const year = date.getFullYear();
      return bookings.filter((b) => {
        const bookingDate = new Date(b.date);
        return bookingDate.getMonth() === month && bookingDate.getFullYear() === year;
      });
    }
    return [];
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
      {/* View Selector */}
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Select View:</h2>
        <Select onValueChange={(value) => setView(value as "daily" | "weekly" | "monthly")}>
          <SelectTrigger className="border border-gray-300 p-2 rounded-md focus:outline-none">
            <SelectValue placeholder="Choose view" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-300 rounded-md shadow-lg">
            <SelectItem value="daily">Daily View</SelectItem>
            <SelectItem value="weekly">Weekly View</SelectItem>
            <SelectItem value="monthly">Monthly View</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Calendar Component */}
      <div className="calendar-container shadow-lg p-4 rounded-lg bg-white">
        <Calendar
          onChange={(value) => setDate(value as Date)}
          value={date}
          tileClassName={({ date, view }) =>
            view === "month"
              ? `calendar-tile ${isBooked(date.toISOString().split("T")[0], "") ? "bg-red-300" : "hover:bg-blue-100"}`
              : ""
          }
          
        />
      </div>

      {/* Display Booked Slots Based on View */}
      <div className="mt-4">
        <h2 className="text-lg font-semibold">Booked Slots ({view} view):</h2>
        {filterBookings().length === 0 ? (
          <p className="text-gray-500">No bookings for this period.</p>
        ) : (
          <ul className="list-disc pl-4">
            {filterBookings().map((booking, index) => (
              <li key={index} className="text-red-500">
                {booking.date} - {booking.time}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Select Time & Book Slot */}
      {date && (
        <div className="mt-4">
          <h2 className="text-lg font-bold">Select a time:</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {times.map((time) => (
              <button
                key={time}
                className={`p-2 rounded transition ${
                  isBooked(date.toISOString().split("T")[0], time) ? "bg-red-500" : "bg-blue-500"
                } text-white hover:bg-opacity-80`}
                onClick={() => setSelectedTime(time)}
                disabled={isBooked(date.toISOString().split("T")[0], time)}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
