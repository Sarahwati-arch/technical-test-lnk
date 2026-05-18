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
    <div
      style={{
        minHeight: "100vh",
        background: "var(--color-background)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* ── Header ── */}
      <header
        style={{
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)",
          padding: "0",
          position: "sticky",
          top: 0,
          zIndex: 40,
          boxShadow: "0 4px 20px rgba(99, 102, 241, 0.25)",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Logo icon */}
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
              }}
            >
              📅
            </div>
            <div>
              <h1
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#fff",
                  margin: 0,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                }}
              >
                Event Dashboard
              </h1>
              <p
                style={{
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.7)",
                  margin: 0,
                  fontWeight: 400,
                }}
              >
                Manage your schedule
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff",
              padding: "8px 18px",
              borderRadius: "var(--radius-sm)",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all var(--transition-fast)",
              fontFamily: "'Inter', sans-serif",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.25)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.15)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "24px 24px 48px",
        }}
      >
        {/* Stats & Action Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "22px",
                fontWeight: 700,
                color: "var(--color-text-primary)",
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              Calendar
            </h2>
            <p
              style={{
                fontSize: "14px",
                color: "var(--color-text-secondary)",
                margin: "2px 0 0",
              }}
            >
              {events.length} event{events.length !== 1 ? "s" : ""} scheduled
            </p>
          </div>

          <button
            onClick={openModal}
            style={{
              background: "var(--color-primary)",
              color: "#fff",
              border: "none",
              padding: "10px 22px",
              borderRadius: "var(--radius-sm)",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all var(--transition-fast)",
              boxShadow: "0 2px 8px var(--color-primary-glow)",
              fontFamily: "'Inter', sans-serif",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--color-primary-hover)";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 20px var(--color-primary-glow)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--color-primary)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 8px var(--color-primary-glow)";
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Create Data
          </button>
        </div>

        {/* Calendar Card */}
        <div
          style={{
            background: "var(--color-surface)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-md)",
            padding: "20px",
            border: "1px solid var(--color-border-light)",
            height: "calc(100vh - 200px)",
            minHeight: "500px",
          }}
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

      {/* ── Create Data Modal ── */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        closeTimeoutMS={250}
        style={{
          overlay: {
            backgroundColor: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
            padding: "20px",
          },
          content: {
            position: "relative",
            inset: "auto",
            background: "var(--color-surface)",
            borderRadius: "var(--radius-xl)",
            boxShadow: "var(--shadow-xl)",
            padding: "0",
            border: "1px solid var(--color-border-light)",
            maxWidth: "460px",
            width: "100%",
            maxHeight: "90vh",
            overflow: "auto",
          },
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "24px 28px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: 700,
                color: "var(--color-text-primary)",
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              Create Data
            </h2>
            <p
              style={{
                fontSize: "13px",
                color: "var(--color-text-muted)",
                margin: "4px 0 0",
              }}
            >
              Add a new event to the calendar
            </p>
          </div>
          <button
            onClick={closeModal}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              border: "none",
              background: "var(--color-background)",
              color: "var(--color-text-muted)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              transition: "all var(--transition-fast)",
              fontFamily: "'Inter', sans-serif",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--color-border)";
              e.currentTarget.style.color = "var(--color-text-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--color-background)";
              e.currentTarget.style.color = "var(--color-text-muted)";
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: "20px 28px 28px" }}>
          {serverError && (
            <div
              style={{
                marginBottom: "16px",
                padding: "12px 16px",
                background: "var(--color-danger-light)",
                color: "var(--color-danger)",
                borderRadius: "var(--radius-sm)",
                fontSize: "13px",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: "8px",
                border: "1px solid rgba(239, 68, 68, 0.15)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 5v3.5M8 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(handleCreateEvent)}>
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {/* Email Field */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "var(--color-text-primary)",
                    marginBottom: "6px",
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  {...register("email")}
                  placeholder="contoh@email.com"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: `1.5px solid ${errors.email ? "var(--color-danger)" : "var(--color-border)"}`,
                    borderRadius: "var(--radius-sm)",
                    fontSize: "14px",
                    color: "var(--color-text-primary)",
                    background: "var(--color-surface)",
                    outline: "none",
                    transition: "all var(--transition-fast)",
                    fontFamily: "'Inter', sans-serif",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--color-primary)";
                    e.currentTarget.style.boxShadow = "0 0 0 3px var(--color-primary-glow)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = errors.email ? "var(--color-danger)" : "var(--color-border)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                {errors.email && (
                  <p style={{ marginTop: "4px", fontSize: "12px", color: "var(--color-danger)", fontWeight: 500 }}>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Date Field */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "var(--color-text-primary)",
                    marginBottom: "6px",
                  }}
                >
                  Date
                </label>
                <input
                  type="date"
                  {...register("date")}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: `1.5px solid ${errors.date ? "var(--color-danger)" : "var(--color-border)"}`,
                    borderRadius: "var(--radius-sm)",
                    fontSize: "14px",
                    color: "var(--color-text-primary)",
                    background: "var(--color-surface)",
                    outline: "none",
                    transition: "all var(--transition-fast)",
                    fontFamily: "'Inter', sans-serif",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--color-primary)";
                    e.currentTarget.style.boxShadow = "0 0 0 3px var(--color-primary-glow)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = errors.date ? "var(--color-danger)" : "var(--color-border)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                {errors.date && (
                  <p style={{ marginTop: "4px", fontSize: "12px", color: "var(--color-danger)", fontWeight: 500 }}>
                    {errors.date.message}
                  </p>
                )}
              </div>

              {/* Description Field */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "var(--color-text-primary)",
                    marginBottom: "6px",
                  }}
                >
                  Description
                </label>
                <textarea
                  {...register("description")}
                  rows={3}
                  placeholder="Masukkan deskripsi"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: `1.5px solid ${errors.description ? "var(--color-danger)" : "var(--color-border)"}`,
                    borderRadius: "var(--radius-sm)",
                    fontSize: "14px",
                    color: "var(--color-text-primary)",
                    background: "var(--color-surface)",
                    outline: "none",
                    transition: "all var(--transition-fast)",
                    fontFamily: "'Inter', sans-serif",
                    resize: "vertical",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--color-primary)";
                    e.currentTarget.style.boxShadow = "0 0 0 3px var(--color-primary-glow)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = errors.description ? "var(--color-danger)" : "var(--color-border)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                {errors.description && (
                  <p style={{ marginTop: "4px", fontSize: "12px", color: "var(--color-danger)", fontWeight: 500 }}>
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>

            {/* Divider */}
            <div
              style={{
                height: "1px",
                background: "var(--color-border-light)",
                margin: "24px 0 20px",
              }}
            />

            {/* Actions */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={closeModal}
                style={{
                  flex: 1,
                  padding: "10px 18px",
                  borderRadius: "var(--radius-sm)",
                  border: "1.5px solid var(--color-border)",
                  background: "var(--color-surface)",
                  color: "var(--color-text-secondary)",
                  fontSize: "14px",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all var(--transition-fast)",
                  fontFamily: "'Inter', sans-serif",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--color-background)";
                  e.currentTarget.style.borderColor = "var(--color-text-muted)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--color-surface)";
                  e.currentTarget.style.borderColor = "var(--color-border)";
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  flex: 1,
                  padding: "10px 18px",
                  borderRadius: "var(--radius-sm)",
                  border: "none",
                  background: isSubmitting ? "var(--color-text-muted)" : "var(--color-primary)",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  transition: "all var(--transition-fast)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: isSubmitting ? "none" : "0 2px 8px var(--color-primary-glow)",
                  fontFamily: "'Inter', sans-serif",
                  opacity: isSubmitting ? 0.7 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.background = "var(--color-primary-hover)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.background = "var(--color-primary)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }
                }}
              >
                {isSubmitting && (
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                    <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" opacity="0.75" />
                  </svg>
                )}
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default DashboardPage;
