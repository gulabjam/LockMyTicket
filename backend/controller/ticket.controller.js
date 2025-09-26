import supabase from "../config/supabase.config.js";
import dotenv from "dotenv";
dotenv.config();
import jsonwebtoken from "jsonwebtoken";

export const getUserTickets = async (req, res) => {
  const user_id = req.user.id;
    try {
    const { data: tickets, error: ticketsError } = await supabase
      .from("Tickets")
      .select(`id, eventId, ticketStatus, ticket_count, checkedInAt, purchased_at, QR_JWT, Events(title, locationName, address, city, startTime, endTime, status)`)
      .eq("userId", user_id);
    if (ticketsError) {
      return res.status(400).json({ error: ticketsError.message });
    }
    return res.status(200).json({ tickets });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch tickets" });
  }
};