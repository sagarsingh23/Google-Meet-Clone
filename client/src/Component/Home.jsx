import React from 'react'
import Meeting from './Meeting';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();

    function generateRandomString() {
        const characters = 'abcdefghijklmnopqrstuvwxyz';
        const prefix = Array.from({ length: 3 }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
        const middle = Array.from({ length: 4 }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
        const suffix = Array.from({ length: 3 }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
        return `${prefix}-${middle}-${suffix}`;
    }


    function joinMeeting() {
        const meetingRoomId = generateRandomString();
        navigate(`/meetings/${meetingRoomId}`);

    }
    return (
        <div>
            <h1>Welcome to Google Meet</h1>
            <Button variant='outlined' onClick={joinMeeting}>Create Instant Meeting</Button>
        </div>

    )
}

export default Home