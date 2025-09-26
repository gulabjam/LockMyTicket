import { Server } from "socket.io";
import  supabase  from "@supabase/supabase-js";

let io;

export const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: { origin: "*" }
    });

    io.on("connection", (socket) => {
        console.log("New client connected:", socket.id);

        socket.on('eventSubscription', async (eventId) => {
            socket.join(eventId);
            console.log(`Client ${socket.id} subscribed to event ${eventId}`);

            const { data: ticketsAvailable, error: ticketsError } = await supabase
                .from('Events')
                .select('tickets_available')
                .eq('id', eventId)
                .maybeSingle();
            if (ticketsError) return console.error("Error fetching tickets:", ticketsError);

            const { data: usersInfo, error: usersError } = await supabase
                .from('Tickets')
                .select(`id, userId, users(username,email), ticketStatus, ticket_count, checkedInAt, purchased_at`)
                .eq('event_id', eventId);
            if (usersError) return console.error("Error fetching users info:", usersError);

            const ticketIds = usersInfo.map(ticket => ticket.id);
            let paymentsInfo = [];
            if (ticketIds.length > 0) {
                const { data, error } = await supabase
                    .from('Payments')
                    .select(`id, amount, paymentStatus, method, transactionId, createdAt, ticketId`)
                    .in('ticketId', ticketIds);
                if (!error) paymentsInfo = data;
            }

            const finalData = usersInfo.map(ticket => ({
                ...ticket,
                payment: paymentsInfo.find(payment => payment.ticketId === ticket.id) || null
            }));

            socket.emit('ticketUpdate', {
                ticketsAvailable: ticketsAvailable?.tickets_available || 0,
                users: finalData
            });
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });
    });
}

export const notifyTicketUpdate = async (eventId) => {
    if (!io) return console.error("Socket.io not initialized.");

    const { data: ticketsAvailable, error: ticketsError } = await supabase
        .from('Events')
        .select('tickets_available')
        .eq('id', eventId)
        .maybeSingle();
    if (ticketsError) return console.error("Error fetching tickets:", ticketsError);

    const { data: usersInfo, error: usersError } = await supabase
        .from('Tickets')
        .select(`id, userId, users(username,email), ticketStatus, ticket_count, checkedInAt, purchased_at`)
        .eq('event_id', eventId);
    if (usersError) return console.error("Error fetching users info:", usersError);

    const ticketIds = usersInfo.map(ticket => ticket.id);
    let paymentsInfo = [];
    if (ticketIds.length > 0) {
        const { data, error } = await supabase
            .from('Payments')
            .select(`id, amount, paymentStatus, method, transactionId, createdAt, ticketId`)
            .in('ticketId', ticketIds);
        if (!error) paymentsInfo = data;
    }

    const finalData = usersInfo.map(ticket => ({
        ...ticket,
        payment: paymentsInfo.find(payment => payment.ticketId === ticket.id) || null
    }));

    io.to(eventId).emit('ticketUpdate', {
        ticketsAvailable: ticketsAvailable?.tickets_available || 0,
        users: finalData
    });

    console.log(`Notified event ${eventId} of ticket update`, {
        ticketsAvailable: ticketsAvailable?.tickets_available || 0,
        users: finalData
    });
}
