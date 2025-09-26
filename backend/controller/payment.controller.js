import supabase from "../config/supabase.config.js";
import razorpayInstance from "../config/razorpay.config.js";
import crypto from "crypto";
import jsonwebtoken from "jsonwebtoken";

export const createPayment = async (req, res) => {
  const user_id = req.user.id;
  const event_id = req.body.eventId;
  const count = req.body.ticketCount;
  const { data: amount, error: amountError } = await supabase
    .from("Events")
    .select("price")
    .eq("id", event_id)
    .maybeSingle();
  if (amountError) {
    return res.status(400).json({ error: amountError.message });
  }
  const totalAmount = amount.price * count;
  const options = {
    amount: totalAmount * 100,
    currency: "INR",
    receipt: `receipt_order_${user_id}_${event_id}`,
  };
  try {
    razorpayInstance.orders.create(options, (err, order) => {
      if (err) {
        return res.status(500).json({ error: "Failed to create order" });
      }
      return res.status(200).json({ order });
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to create order" });
  }
};

export const verifyPayment = async (req, res) => {
  const user_id = req.user.id;
  const event_id = req.body.event_id;
  const order_id = req.body.order_id;
  const payment_id = req.body.payment_id;
  const signature = req.body.signature;
  const count = req.body.count;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  const hmac = crypto.createHmac("sha256", key_secret);
  hmac.update(order_id + "|" + payment_id);
  const generatedSignature = hmac.digest("hex");
  if (generatedSignature === signature) {
    const paymentData = await razorpayInstance.payments.fetch(payment_id);
    if (paymentData.status !== "captured") {
      return res.status(400).json({ error: "Payment not captured" });
    }
    const { data: ticketData, error: ticketError } = await supabase
      .from("Tickets")
      .insert([
        {
          userId: user_id,
          eventId: event_id,
          ticketStatus: "valid",
          ticket_count: count,
        },
      ])
      .select();
    if (ticketError) {
      return res.status(400).json({ error: ticketError.message });
    }
    const ticketId = ticketData[0].id;
    const { error: paymentError } = await supabase
      .from("Payments")
      .insert([
        {
          userId: user_id,
          ticketId: ticketId,
          amount: paymentData.amount / 100,
          method: paymentData.method,
          paymentStatus: paymentData.status,
          transactionId: paymentData.id,
        },
      ]);
    if (paymentError) {
      return res.status(400).json({ error: paymentError.message });
    }
    const { error: updateError } = await supabase.rpc("decrement_tickets", {
      eid: event_id,
      c: count,
    });
    if (updateError) {
      return res.status(400).json({ error: updateError.message });
    }
    const {data: eventData, error: eventError } = await supabase
      .from("Events")
      .select("endTime")
      .eq("id", event_id)
      .maybeSingle();
    const exp = Math.floor(new Date(eventData.endTime).getTime() / 1000);
    if (eventError) {
      return res.status(400).json({ error: eventError.message });
    }
    const qrTicketPayload = { ticketId: ticketId, userId: user_id, eventId: event_id, exp: exp};
    const ticketToken = jsonwebtoken.sign(qrTicketPayload, process.env.JWT_SECRET);
    const { error: qrError } = await supabase
      .from("Tickets")
      .update({ QR_JWT: ticketToken })
      .eq("id", ticketId);
    if (qrError) {
      return res.status(400).json({ error: qrError.message });
    }
    return res
      .status(200)
      .json({ message: "Payment verified successfully", ticketId: ticketId });
  } else {
    return res.status(400).json({ error: "Invalid signature" });
  }
};
