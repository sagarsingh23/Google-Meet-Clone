import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Grid, Typography } from '@mui/material'
import socketIO from 'socket.io-client'
import { Video } from './Video';
import {
    BsCameraVideo,
    BsCameraVideoOff,
    BsMic,
    BsMicMute
} from 'react-icons/bs'
import { useRecoilState } from 'recoil';
import { meetingJoinedState } from '../store/meetingAtoms';

let pc = new RTCPeerConnection({
    iceServers: [
        {
            urls: "stun:stun.l.google.com:19302",
        },
    ],
});


function Meeting() {


    const [video, setVideo] = React.useState(false)
    const [audio, setAudio] = React.useState(false)
    const [socket, setSocket] = React.useState(false);
    const [videoStream, setVideoStream] = React.useState()
    const [remoteVideoStream, setRemoteVideoStream] = React.useState();

    const [meetingJoined, setMeetingJoined] = useRecoilState(meetingJoinedState);

    // const [meetingJoined, setMeetingJoined] = React.useState(false);

    const params = useParams();
    const meetingId = params.meetingId;

    const navigate = useNavigate();


    const handleVideoToggle = () => {
        setVideo((prevVideo) => !prevVideo);
    };

    const handleAudioToggle = () => {
        setAudio((prevAudio) => !prevAudio);
    };


    React.useEffect(() => {
        const s = socketIO.connect('https://7709-2406-b400-60-721b-d70b-1627-56d9-ed66.ngrok-free.app');
        console.log(s, "socket")
        s.on("connect", () => {
            setSocket(s);
            s.emit("join", {
                meetingId
            })

            window.navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            }).then(async (stream) => {
                setVideoStream(stream);
            });
        });
    }, [])

    React.useEffect(() => {
        if (!socket) return; // Ensure the socket is available

        // Create a new MediaStream object to hold all incoming tracks
        const combinedRemoteStream = new MediaStream();

        const handleLocalDescription = async ({ description }) => {
            pc.setRemoteDescription(description);
            pc.ontrack = (e) => {
                console.log(e, "event")
                combinedRemoteStream.addTrack(e.track);
                setRemoteVideoStream(combinedRemoteStream);
            };

            socket.on("iceCandidate", ({ candidate }) => {
                pc.addIceCandidate(candidate);
            });

            pc.onicecandidate = ({ candidate }) => {
                socket.emit("iceCandidateReply", { candidate });
            };

            await pc.setLocalDescription(await pc.createAnswer());
            socket.emit("remoteDescription", { description: pc.localDescription });
        };

        socket.on("localDescription", handleLocalDescription);

        return () => {
            socket.off("localDescription", handleLocalDescription); // Clean up the listener
        };
    }, [socket]);

    // This useEffect handles the remote description setup
    React.useEffect(() => {
        if (!socket) return; // Ensure the socket is available

        const handleRemoteDescription = ({ description }) => {
            console.log({ description });
            const combinedRemoteStream = new MediaStream();
            pc.setRemoteDescription(description);
            pc.ontrack = (e) => {
                console.log(e, "event")
                combinedRemoteStream.addTrack(e.track);
                setRemoteVideoStream(combinedRemoteStream);
            };

            socket.on("iceCandidate", ({ candidate }) => {
                pc.addIceCandidate(candidate);
            });

            pc.onicecandidate = ({ candidate }) => {
                socket.emit("iceCandidateReply", { candidate });
            };
        };

        socket.on("remoteDescription", handleRemoteDescription);

        return () => {
            socket.off("remoteDescription", handleRemoteDescription); // Clean up the listener
        };
    }, [socket]);

    if (!videoStream) {
        return <div>
            Loading...
        </div>
    }


    async function startMeeting() {
        console.log("starting meeting")

        pc.onicecandidate = ({ candidate }) => {
            socket.emit("iceCandidate", { candidate });
        }

        videoStream.getTracks().forEach((track) => {
            pc.addTrack(track);
        })

        pc.onnegotiationneeded = async () => {
            try {
                await pc.setLocalDescription(await pc.createOffer());
                console.log({ aa: pc.localDescription });
                socket.emit("localDescription", { description: pc.localDescription });
            } catch (err) {
                console.log({ msg: err?.message });
                console.error(err);
            }
        }
        setMeetingJoined(true);
    }


    if (videoStream && remoteVideoStream) {
        console.log(videoStream.getTracks(), "video", remoteVideoStream.getTracks(), "remote");
    }




    if (!meetingJoined) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
            <div style={{ display: 'flex', flexDirection: 'column', marginRight: '40px' }}>
                <div style={{ backgroundColor: 'black', borderRadius: '10px', width: '30vw', height: '50vh', color: 'white' }}>
                    {
                        videoStream && videoStream.getVideoTracks()[0] ? (
                            <Video muted={true} stream={videoStream} />
                        ) : (
                            <p style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}> Camera is off</p>
                        )
                    }
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', height: "60px", marginTop: "5px" }}>
                    <button
                        className='icons-button'
                        onClick={handleVideoToggle}
                    >
                        {video ? <BsCameraVideo /> : <BsCameraVideoOff />}
                    </button>
                    <button
                        className='icons-button'
                        onClick={handleAudioToggle}
                    >
                        {audio ? <BsMic /> : <BsMicMute />}
                    </button>
                </div>
            </div>

            <div style={{ border: '5px solid black', width: '400px', height: '200px', textAlign: 'center' }}>
                <h1>
                    Meeting <span style={{ color: 'purple' }}>{params.meetingId}</span>
                </h1>
                <Button variant='contained' color='secondary' style={{ marginRight: '10px' }} onClick={startMeeting} disabled={!socket}> Join Now </Button>
                <Button variant='contained' color='primary' onClick={() => {
                    navigate('/home')
                }}> Back </Button>
            </div>
        </div >
    }

    return <Grid container spacing={2} alignContent={"center"} justifyContent={"center"}>
        <Grid item xs={12} md={6} lg={4}>
            <Video muted={true} stream={videoStream} />
        </Grid>
        {remoteVideoStream &&
            <Grid item xs={12} md={6} lg={4}>
                <Video muted={false} stream={remoteVideoStream} />
            </Grid>
        }
    </Grid>


}

export default Meeting;