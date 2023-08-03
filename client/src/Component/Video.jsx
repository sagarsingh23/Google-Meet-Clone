import { useEffect, useRef } from "react";

export const Video = ({ stream , muted }) => {
    // console.log(stream, "video comp", stream ? stream.getTracks() : null)
    const videoRef = useRef();
    useEffect(() => {
        if (videoRef && videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }, [videoRef])

    return (
        <div>
            <div>
                <video style={{ width: "100%", borderRadius: "10px" }} ref={videoRef} muted={muted} autoPlay={true} playsInline={true} />
            </div>
        </div>
    )
}