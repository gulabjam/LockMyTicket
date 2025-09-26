import uploadFiles from '../config/cloudinary.config.js';
import supabase from '../config/supabase.config.js';
import dotenv from 'dotenv';
import fs from 'fs';
import { upload } from '../middleware/multer.middleware.js';
dotenv.config();

export const registerAsOrganizer = async (req, res) => {
    console.log('registerAsOrganizer called');
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);
    // receives multipart/form-data
    // fields: orgName, contact_no, address, description, id, Kycdoc (file)
    // id is user id from the users table
    const organiserData = req.body;
    const id = req.user.id;
        try {
        if (!organiserData.orgName || !organiserData.contact_no || !organiserData.address || !organiserData.description) 
            return res.status(400).json({ error: 'All fields are required' });
        if (!req.file) 
            return res.status(400).json({ error: 'Kyc Document is not attached' });
        const KYCDoc = req.file;
        const kycUrl = await uploadFiles(KYCDoc.path);
        if (KYCDoc && KYCDoc.path && fs.existsSync(KYCDoc.path)) {
            fs.unlinkSync(KYCDoc.path);
        }
        if (!kycUrl)
            return res.status(500).json({ error: 'Error uploading KYC document' });
        const {data, error} = await supabase
            .from('users')
            .update({role: 'organizer'})
            .eq('id', id);
        if (error) 
            return res.status(500).json({ error: error.message });
        const {data: orgData, error: orgError} = await supabase
            .from('organizers')
            .insert([{
                orgName: organiserData.orgName,
                contact_no: organiserData.contact_no,
                address: organiserData.address,
                description: organiserData.description,
                kycdocUrl: kycUrl,
                id: id
            }]);
        if (orgError) 
            return res.status(500).json({ error: 'Error registering organizer' });
        return res.status(200).json({ message: 'Organizer registered successfully', organizer: orgData });
    } catch (error) {
        console.error('Error in registerAsOrganizer:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const getOrganizerDetails = async (req, res) => {
    const userId = req.user.id; 
    try {
        const {data: organizer, error} = await supabase
            .from('organizers')
            .select('*')
            .eq('id', userId)
            .maybeSingle();
        if (error) 
            return res.status(500).json({ error: error.message });
        if (!organizer) 
            return res.status(404).json({ error: 'Organizer not found' });
        return res.status(200).json({ organizer });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const createEvent = async (req, res) => {
    // receives multipart/form-data
    // fields: orgId, title, description, posterUrl (file), locationName, address, city, startTime, endTime, price, status, video_url, images_url (files), tickets_available
    try {
        const organizerId = req.user.id;
        const eventData = req.body;
        if (!eventData.title || !eventData.description || !eventData.locationName || !eventData.address || !eventData.city || !eventData.startTime || !eventData.endTime || !eventData.price || !eventData.tickets_available)
            return res.status(400).json({ error: 'All fields are required' });
        if (new Date(eventData.startTime) >= new Date(eventData.endTime) && new Date(eventData.startTime) < new Date())
            return res.status(400).json({ error: 'Event end time must be after start time' });
        if (!req.files || req.files.length === 0)
            return res.status(400).json({ error: 'Event poster is required' });
        const posterUrl = req.files.poster? await uploadFiles(req.files.poster[0].path) : null;
        if(req.files.poster) fs.unlinkSync(req.files.poster[0].path);
        if (!posterUrl)
            return res.status(500).json({ error: 'Error uploading event poster' });
        let imageUrls = [];
        if (req.files.image && req.files.image.length > 0){
            imageUrls = await Promise.all (req.files.image.map(async (file) => {
                const url = await uploadFiles(file.path);
                fs.unlinkSync(file.path);
                return url;
                })
            );
        }
        const videoUrl = req.files.video ? await uploadFiles(req.files.video[0].path) : null;
        if (req.files.video) fs.unlinkSync(req.files.video[0].path);
        const {data, error} = await supabase
            .from('Events')
            .insert([{
                orgId: organizerId,
                title: eventData.title,
                description: eventData.description,
                posterURL: posterUrl,
                locationName: eventData.locationName,
                address: eventData.address,
                city: eventData.city,
                startTime: eventData.startTime,
                endTime: eventData.endTime,
                price: eventData.price,
                status: eventData.status || 'upcoming',
                video_url: videoUrl,
                images_url: imageUrls,
                tickets_available: eventData.tickets_available
            }]);
        if (error) 
            return res.status(500).json({ error: 'Error uploading event' });
        return res.status(200).json({ message: 'Event created successfully', event: data });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const getEventsByOrganizer = async (req, res) => {
    const organizerId = req.user.id; 
    try {
        const {data: events, error} = await supabase
            .from('Events')
            .select('*')
            .eq('orgId', organizerId);
        if (error) 
            return res.status(500).json({ error: error.message });
        return res.status(200).json({ events });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};