import { useEffect, useRef } from "react";

export const Video = ({ stream }) => {
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
                <video style={{ width: "100%", borderRadius: "10px" }} ref={videoRef} autoPlay={true} playsInline={true} />
            </div>
        </div>
    )
}