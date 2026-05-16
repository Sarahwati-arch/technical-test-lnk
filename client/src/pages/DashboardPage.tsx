import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  dateFnsLocalizer,
  type View,
} from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { logout as logoutApi } from "../api/auth.api";
import {
  getEvents,
  createEvent,
  deleteEvent,
  type EventData,
} from "../api/event.api";
import {
  createEventSchema,
  type CreateEventFormData,
} from "../schemas/event.schema";

Modal.setAppElement("#root");

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description: string;
}

const mapToCalendarEvents = (data: EventData[]): CalendarEvent[] =>
  data.map((e) => {
    const dateObj = new Date(e.date + "T00:00:00");
    return {
      id: e._id,
      title: e.email,
      start: dateObj,
      end: dateObj,
      description: e.description,
    };
  });

const DashboardPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<View>("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateEventFormData>({
    resolver: zodResolver(createEventSchema),
  });

  const fetchEvents = useCallback(async () => {
    try {
      const data = await getEvents();
      setEvents(mapToCalendarEvents(data));
    } catch {
      console.error("Failed to fetch events");
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch {
      // ignore — proceed to clear token anyway
    }
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  const openModal = () => {
    setModalOpen(true);
    setServerError("");
  };

  const closeModal = () => {
    setModalOpen(false);
    reset();
    setServerError("");
  };

  const handleCreateEvent = async (data: CreateEventFormData) => {
    try {
      setServerError("");
      await createEvent(data);
      closeModal();
      await fetchEvents();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setServerError(
        error.response?.data?.message || "Terjadi kesalahan saat membuat event"
      );
    }
  };

  const handleSelectEvent = async (event: CalendarEvent) => {
    if (window.confirm(`Hapus event "${event.title}"?`)) {
      try {
        await deleteEvent(event.id);
        await fetchEvents();
      } catch {
        alert("Gagal menghapus event");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 text-sm"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-end mb-4">
          <button
            onClick={openModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
          >
            + Create Data
          </button>
        </div>

        <div
          className="bg-white rounded-lg shadow p-4"
          style={{ height: 600 }}
        >
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            view={currentView}
            onView={setCurrentView}
            date={currentDate}
            onNavigate={setCurrentDate}
            onSelectEvent={handleSelectEvent}
            style={{ height: "100%" }}
            popup
          />
        </div>
      </main>

      {/* Create Data Modal */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto mt-24 outline-none"
        overlayClassName="fixed inset-0 bg-black/50 flex items-start justify-center pt-24"
      >
        <h2 className="text-lg font-bold mb-4">Create Data</h2>

        {serverError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(handleCreateEvent)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="contoh@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              {...register("date")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">
                {errors.date.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan deskripsi"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              )}
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DashboardPage;
