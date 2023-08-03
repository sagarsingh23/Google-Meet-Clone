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
    const [meetingJoined, setMeetingJoined] = React.useState(false);
    const [videoStream, setVideoStream] = React.useState()
    const [remoteVideoStream, setRemoteVideoStream] = React.useState();

    // const videoStreamRef = React.useRef(null);

    const params = useParams();
    const meetingId = params.meetingId;

    const navigate = useNavigate();


    const handleVideoToggle = () => {
        setVideo((prevVideo) => !prevVideo);
    };

    const handleAudioToggle = () => {
        setAudio((prevAudio) => !prevAudio);
    };


    // const getUserStream = async () => {
    //     try {
    //         const localStream = await navigator.mediaDevices.getUserMedia({
    //             audio: audio,
    //             video: video
    //         });
    //         return localStream;
    //     } catch (error) {
    //         return null;
    //     }
    // };

    // React.useEffect(() => {
    //     const fetchData = async () => {
    //         const stream = await getUserStream();
    //         if (stream) {
    //             videoStreamRef.current = stream;
    //             setVideoStream(stream);
    //             stream.onremovetrack = () => {
    //                 console.log("stream ended!!");
    //             };
    //         } else {
    //             setVideoStream(null);
    //         }
    //     };

    //     fetchData();
    //     // await pc.setLocalDescription(await pc.createAnswer());
    //     // s.emit("remoteDescription", { description: pc.localDescription });
    //     // let pc = new RTCPeerConnection({
    //     //     iceServers: [
    //     //         {
    //     //             urls: "stun:stun.l.google.com:19302",
    //     //         },
    //     //     ]
    //     // })

    //     // pc.setRemoteDescription(description);
    //     // pc.ontrack = (e) => {
    //     //     setRemoteVideoStream(new MediaStream[e.track])
    //     // }

    //     // s.on("iceCandidate", ({ candidate }) => {
    //     //     pc.addIceCandidate(candidate)
    //     // })

    //     // pc.onicecandidate = ({ candidate }) => {
    //     //     s.emit("iceCandidateReply", { candidate });
    //     // }

    //     // const pcDescription = await pc.createAnswer();
    //     // await pc.setLocalDescription(pcDescription);
    //     // s.emit("remoteDescription", { description: pc.localDescription })



    // }, [audio, video]);


    React.useEffect(() => {
        const s = socketIO.connect('https://dd09-106-51-81-179.ngrok-free.app');
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

            // s.on("localDescription", async ({ description }) => {

            //     pc.setRemoteDescription(description);
            //     pc.ontrack = (e) => {
            //         console.log(e)
            //         setRemoteVideoStream(new MediaStream([e.track]))
            //     }

            //     s.on("iceCandidate", ({ candidate }) => {
            //         pc.addIceCandidate(candidate)
            //     });

            //     pc.onicecandidate = ({ candidate }) => {
            //         s.emit("iceCandidateReply", { candidate });
            //     }

            //     await pc.setLocalDescription(await pc.createAnswer());
            //     s.emit("remoteDescription", { description: pc.localDescription });
            // });

            // s.on("remoteDescription", async ({ description }) => {
            //     console.log({ description });
            //     pc.setRemoteDescription(description)
            //     pc.ontrack = (e) => {
            //         setRemoteVideoStream(new MediaStream([e.track]));
            //     };

            //     s.on("iceCandidate", ({ candidate }) => {
            //         pc.addIceCandidate(candidate);
            //     });

            //     pc.onicecandidate = ({ candidate }) => {
            //         s.emit("iceCandidateReply", { candidate });
            //     };
            // });
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
            // pc.ontrack = (e) => {
            //     console.log(e, "event1");
            //     // setRemoteVideoStream(((remoteStream) => {
            //     //   if(!remoteStream){
            //     //     new MediaStream([e.track]);
            //     //     console.log(new MediaStream(), "media stream")
            //     //   }else{
            //     //     console.log("comming in remote");
            //     //   }
            //     // }));
            // };

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



    // React.useEffect(() => {
    //     if (videoStream) {
    //         // console.log(videoStream.getTracks(), "videoStream", video, audio)
    //         if (!video && audio) {
    //             // console.log("video disabling")
    //             videoStream.getTracks().forEach((track) => {
    //                 if (track.readyState === "live" && track.kind === "video") {
    //                     track.stop();
    //                 }
    //             });
    //         } else if (!audio && video) {
    //             // console.log("audio disabling")
    //             videoStream.getTracks().forEach((track) => {
    //                 if (track.readyState === "live" && track.kind === "audio") {
    //                     track.stop();
    //                 }
    //             });
    //         } else if (!audio && !video) {
    //             // console.log("disabling both audio and video ")
    //             videoStream.getTracks().forEach((track) => {
    //                 track.stop();
    //             });
    //         }
    //     }
    // }, [videoStream, video, audio])


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
                            <Video stream={videoStream} />
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
            <Video stream={videoStream} />
        </Grid>
        {remoteVideoStream &&
            <Grid item xs={12} md={6} lg={4}>
                <Video stream={remoteVideoStream} />
            </Grid>
        }
    </Grid>


}

export default Meeting;