import React, { useRef, useState, useEffect } from 'react'
import Meeting from './Meeting';
import { Button, InputAdornment, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GoogleMeetIconHome from '../Assests/GoogleMeetIconHome.jpg'
import { MdPhotoCameraFront, MdKeyboardHide, MdLink } from 'react-icons/md'
import { AiOutlinePlus } from 'react-icons/ai'
import { BsCalendar } from 'react-icons/bs'

import homeSvg from '../Assests/home.svg'
import { useSetRecoilState } from 'recoil';
import { meetingJoinedState } from '../store/meetingAtoms';

function Home() {
    const navigate = useNavigate();
    const [clicked, setClicked] = useState(false);
    const modal = useRef(null);

    const setMeetingJoined = useSetRecoilState(meetingJoinedState);

    function generateRandomString() {
        const characters = 'abcdefghijklmnopqrstuvwxyz';
        const prefix = Array.from({ length: 3 }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
        const middle = Array.from({ length: 4 }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
        const suffix = Array.from({ length: 3 }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
        return `${prefix}-${middle}-${suffix}`;
    }


    function joinMeeting() {
        setMeetingJoined(true);
        const meetingRoomId = generateRandomString();
        navigate(`/meetings/${meetingRoomId}`);
    }

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (modal.current && !modal.current.contains(event.target)) {
                setClicked(false);
            }
        };

        if (clicked) {
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.removeEventListener('mousedown', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [clicked]);




    return (
        <div>
            <div>
                <div >
                    <a style={{ display: 'flex', height: '50px', alignItems: 'center', padding: '10px' }}>
                        <img src={GoogleMeetIconHome} style={{ height: '40px', width: '124px', paddingLeft: '10px' }} />
                        <span style={{ fontSize: '22px', paddingLeft: '4px', fontFamily: 'Arial,sans-serif', lineHeight: '24px', paddingBottom: '2.5px', color: '#5A5A5A' }}>Meet Clone</span>
                    </a>
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '44px' }}>
                <div style={{ flexBasis: '50%', padding: '1em 3em' }}>
                    <div style={{ fontSize: '2.75em', fontFamily: 'Google Sans Display,Roboto,Arial,sans-serif', paddingBottom: '0.5em' }}>
                        Premium video meetings. Now free for everyone.
                    </div>
                    <div style={{ fontSize: '1.125rem', fontWeight: '400px', paddingBottom: '3.2em', color: '#5f6368' }}>
                        We re-engineered the service we built for secure business <br />
                        meetings, Google Meet, to make it free and available for all.
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        <div>
                            <div id='firstDiv'>
                                <div>
                                    <Button
                                        style={{
                                            textTransform: 'none',
                                            fontSize: '1.125em',
                                            height: '56px',
                                            marginRight: '25px',
                                            borderRadius: '5px',
                                            lineHeight: '10px'
                                        }}
                                        variant='contained'
                                        onClick={() => {
                                            setClicked(true);
                                        }}>
                                        <MdPhotoCameraFront />
                                        <span style={{ paddingLeft: '5px' }}>New meeting</span>
                                    </Button>
                                </div>
                            </div>
                            {clicked &&
                                <div id='secondDiv' ref={modal}>
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '88px',
                                        zIndex: 1,
                                        height: '160px',
                                        width: '290px',
                                        backgroundColor: 'white',
                                        borderRadius: '5px',
                                        boxShadow: '0 4px 6px 0px rgba(0,0,0,.2), 0 6px 10px 0 rgba(0,0,0,.14), 0 1px 18px 0 rgba(0,0,0,.12)'
                                    }}>
                                        <ul style={{
                                            padding: '2px 0px',
                                            marginTop: '8px',
                                            fontFamily: 'Roboto,Arial,sans-serif',
                                            lineHeight: '1.5rem'
                                        }}>
                                            <li className='create-meeting-list-items'
                                                onClick={() => {
                                                    alert("create Meeting")
                                                }}
                                            >
                                                <span className='create-meeting-item'><MdLink /></span>
                                                <span>Create a meeting for later</span>
                                            </li >
                                            <li className='create-meeting-list-items'
                                                onClick={joinMeeting}
                                            >
                                                <span className='create-meeting-item'><AiOutlinePlus /></span>
                                                <span>Start an instant meeting</span>
                                            </li>
                                            <li className='create-meeting-list-items'
                                                onClick={() => {
                                                    alert("create google calender")
                                                }}>
                                                <span className='create-meeting-item'><BsCalendar /></span>
                                                <span>Schedule in Google Calendar</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            }
                        </div>
                        <div>
                            <TextField
                                sx={{ border: '0.5px solid grey', borderRadius: '5px' }}
                                variant='outlined'
                                id="outlined-basic"
                                placeholder='Enter a code or link'
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment style={{ fontSize: '1.3em', paddingRight: '10px' }}>
                                            <MdKeyboardHide />
                                        </InputAdornment>
                                    )
                                }} >
                            </TextField>
                        </div>
                    </div>
                    <div style={{ marginTop: '2.2em', borderBottom: '1px solid', borderColor: '#dadce0' }}>
                    </div>
                    <div style={{ paddingTop: '1.5em', color: '#5f6368' }}>
                        <span style={{ color: 'blue' }}>Learn more</span> about Google Meet Clone
                    </div>
                </div>
                <div style={{ display: 'flex', flexBasis: '50%', alignItems: 'center', padding: '1em 3em', flexDirection: 'column' }} >
                    <div style={{ width: '360px', textAlign: 'center' }}>
                        <img src={homeSvg} style={{ height: '20.625rem', width: '20.625rem' }} />
                        <div style={{ paddingTop: "10px" }}>
                            <div style={{ fontSize: '1.5rem', fontFamily: 'Google Sans,Roboto,Arial,sans-serif' }}>
                                Get a link you can share
                            </div>
                            <div style={{ fontSize: '0.875rem', fontFamily: 'Roboto,Arial,sans-serif' }}>
                                Click <span style={{ fontWeight: 'bold' }}> New Meeting </span> to get a link you can send to people you want to meet with
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Home