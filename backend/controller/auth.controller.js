
import bcrypt from 'bcryptjs';
import supabase from '../config/supabase.config.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const signUp = async (req, res) => {
    try{
        const {name ,email, password, confirmPassword} = req.body;
        if (password !== confirmPassword) 
            return res.status(400).json({ error: 'Passwords do not match' });
        else if (password.length < 6)
            return res.status(400).json({ error: 'Password must be at least 6 characters long' });
        const {data: existingUser, error: fetchError} = await supabase
            .from('users')
            .select('*')
            .eq('email_id', email)  
            .maybeSingle();
        if (fetchError){ 
            return res.status(500).json({ error: 'Database error' });
        }
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const {data, error} = await supabase
            .from('users')
            .insert([{name : name, email_id : email, password: hashedPassword }]);
        if (error) {            
            return res.status(400).json({ error: error.message });
        }
        else {
            return res.status(200).json({ message: 'User registered successfully'});
        }   
    }
    catch(err){
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const login = async (req, res) => {
    try{
        const {email, password} = req.body;
        const {data: user, error: fetchError} = await supabase
        .from('users')
        .select('*')
        .eq('email_id', email)  
        .maybeSingle();
        if (fetchError) {
            return res.status(500).json({ error: 'Database error' });
        }  
        if (!user){
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        const decryptedPassword = await bcrypt.compare(password, user.password);
        if (!decryptedPassword) {         
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        else{
            const token = jwt.sign({ id: user.id, email: user.email_id, role : user.role, name: user.name}, process.env.JWT_SECRET);
            return res.status(200).json({ message: 'Login successful', user : {user_id : user.id, email : user.email_id, name : user.name, role : user.role}, token : token });
        }
    }
    catch(err){      
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const fetchProfile = async (req, res) => {
    try{
        const userId = req.user.id;
        const {data: user, error: fetchError} = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)  
        .maybeSingle();
        if (fetchError) {
            return res.status(500).json({ error: 'Database error' });
        }  
        if (!user){
            return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json({ user : {user_id : user.id, email : user.email_id, name : user.name, role : user.role} });
    }
    catch(err){      
        return res.status(500).json({ error: 'Internal server error' });
    }
};
