import { z } from "zod";

export const createEventSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD"),
  description: z.string().min(1, "Deskripsi tidak boleh kosong"),
});

export type CreateEventFormData = z.infer<typeof createEventSchema>;
