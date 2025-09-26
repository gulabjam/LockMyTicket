import supabase from '../config/supabase.config.js';

export const updateEvent = async (req, res) => {
    const userId = req.user.id;
    const eventId = req.body.id;
    const eventData = req.body;
    
    try {
        if (!eventId) {
            return res.status(400).json({ error: 'Event ID is required' });
        }
        const { data: existingEvent, error: fetchError } = await supabase
            .from('Events')
            .select('*')
            .eq('id', eventId)
            .single();

        if (fetchError) {
            console.error('Fetch error:', fetchError);
            return res.status(500).json({ error: 'Error fetching event' });
        }

        if (!existingEvent) {
            return res.status(404).json({ error: 'Event not found' });
        }
        if (existingEvent.orgId !== userId) {
            return res.status(403).json({ error: 'Not authorized to update this event' });
        }
        const { id, ...updateData } = eventData;
        if (updateData.startTime && updateData.endTime) {
            const startTime = new Date(updateData.startTime);
            const endTime = new Date(updateData.endTime);
            
            if (startTime >= endTime) {
                return res.status(400).json({ error: 'Event end time must be after start time' });
            }
            
            if (endTime < new Date()) {
                return res.status(400).json({ error: 'Event end time cannot be in the past' });
            }
        }

        const { data, error } = await supabase
            .from('Events')
            .update(updateData)
            .eq('id', eventId)
            .select() 
            .single();

        if (error) {
            console.error('Update error:', error);
            return res.status(500).json({ error: 'Error updating event: ' + error.message });
        }
        return res.status(200).json({ event: data });

    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const deleteEvent = async (req, res) => {
    const userId = req.user.id;
    const eventId = req.body.id;

    try {
        if (!eventId) {
            return res.status(400).json({ error: 'Event ID is required' });
        }

        const { data: existingEvent, error: fetchError } = await supabase
            .from('Events')
            .select('*')
            .eq('id', eventId)
            .single();

        if (fetchError) {
            console.error('Fetch error:', fetchError);
            return res.status(500).json({ error: 'Error fetching event' });
        }

        if (!existingEvent) {
            return res.status(404).json({ error: 'Event not found' });
        }

        if (existingEvent.orgId !== userId) {
            return res.status(403).json({ error: 'Not authorized to delete this event' });
        }

        const { error: deleteError } = await supabase
            .from('Events')
            .delete()
            .eq('id', eventId);

        if (deleteError) {
            console.error('Delete error:', deleteError);
            return res.status(500).json({ error: 'Error deleting event' });
        }

        return res.status(204).send();

    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const fetchEventsByUser = async (req, res) => {
    const userId = req.user.id;
    try{
        const { data: events, error } = await supabase
            .from('Events')
            .select('id, orgId, organizers(orgName,contact_no), title, description, posterURL, locationName, address, city, startTime, endTime, price, status, video_url, images_url, tickets_available, created_at')
            .in('status', ['upcoming', 'ongoing'])
            .order('startTime', { ascending: false });
        if (error) {
            console.error('Fetch error:', error);
            return res.status(500).json({ error: error.message });
        }
        return res.status(200).json({ events });
    }catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
