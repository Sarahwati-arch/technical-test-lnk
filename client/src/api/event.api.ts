import api from "./axios";

export interface EventData {
  _id: string;
  email: string;
  date: string;
  description: string;
  createdAt: string;
}

export const getEvents = async (): Promise<EventData[]> => {
  const res = await api.get("/events");
  return res.data;
};

export const createEvent = async (data: {
  email: string;
  date: string;
  description: string;
}) => {
  const res = await api.post("/events", data);
  return res.data;
};

export const deleteEvent = async (id: string) => {
  const res = await api.delete(`/events/${id}`);
  return res.data;
};
