import React, { useRef, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import logo from '../assets/Logo.png';

const StreamBoard = () => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [tool, setTool] = useState('brush');
  const [color, setColor] = useState('#000000');
  const [peerConnection, setPeerConnection] = useState(null);
  const [stream, setStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const [recordingBlob, setRecordingBlob] = useState(null);
  const socket = useRef(null);

  useEffect(() => {
    import('fabric').then((fabricModule) => {
      const fabric = fabricModule.default || fabricModule;
  
      if (canvasRef.current) {
        if (canvas) {
          canvas.dispose();
        }
  
        const fabricCanvas = new fabric.Canvas(canvasRef.current, {
          isDrawingMode: true,
        });
        setCanvas(fabricCanvas);
  
        if (fabricCanvas.freeDrawingBrush) {
          fabricCanvas.freeDrawingBrush.color = color;
          fabricCanvas.freeDrawingBrush.width = 5;
        } else {
          fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas);
          fabricCanvas.freeDrawingBrush.color = color;
          fabricCanvas.freeDrawingBrush.width = 5;
        }
      }
    });
  
    socket.current = io(import.meta.env.VITE_BACKEND || 'http://localhost:8080');
  
    return () => {
      if (canvas) {
        canvas.dispose();
      }
      socket.current.disconnect();
    };
  }, []);

  const handleStartCall = async () => {
    try {
      const room = "default-room";
      socket.current.emit("join-room", room);

      const newPeerConnection = new RTCPeerConnection();
      const userStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      userStream.getTracks().forEach(track => newPeerConnection.addTrack(track, userStream));

      const localVideo = document.getElementById("localVideo");
      if (localVideo) localVideo.srcObject = userStream;

      setStream(userStream);
      setPeerConnection(newPeerConnection);

      const offer = await newPeerConnection.createOffer();
      await newPeerConnection.setLocalDescription(offer);
      socket.current.emit("offer", { offer, room });

      newPeerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.current.emit("candidate", { candidate: event.candidate, room });
        }
      };

      newPeerConnection.ontrack = (event) => {
        const remoteVideo = document.getElementById("remoteVideo");
        if (remoteVideo) remoteVideo.srcObject = event.streams[0];
      };
    } catch (error) {
      console.error("Error starting call:", error);
    }
  };

  const handleEndCall = () => {
    if (peerConnection) {
      peerConnection.getTransceivers().forEach(transceiver => transceiver.stop());
      peerConnection.close();
      setPeerConnection(null);
    }

    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }

    const localVideo = document.getElementById("localVideo");
    const remoteVideo = document.getElementById("remoteVideo");

    if (localVideo) localVideo.srcObject = null;
    if (remoteVideo) remoteVideo.srcObject = null;
  };

  const startScreenRecording = async () => {
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      const recorder = new MediaRecorder(displayStream);
      const chunks = [];

      recorder.ondataavailable = (event) => chunks.push(event.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        setRecordingBlob(blob);
        if (window.confirm("Do you want to download the recording?")) {
          downloadRecording(blob);
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
      setScreenStream(displayStream);
    } catch (err) {
      console.error('Error starting screen capture:', err);
    }
  };

  const stopScreenRecording = () => {
    if (mediaRecorder && screenStream) {
      mediaRecorder.stop();
      screenStream.getTracks().forEach(track => track.stop());
      setMediaRecorder(null);
      setScreenStream(null);
    }
  };

  const downloadRecording = (blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'screen-recording.webm';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleToolChange = (type, width) => {
    if (canvas) {
      canvas.isDrawingMode = type !== 'text';
      if (canvas.isDrawingMode) {
        canvas.freeDrawingBrush.color = type === 'eraser' ? '#ffffff' : color;
        canvas.freeDrawingBrush.width = width;
      }
      setTool(type);
    }
  };

  const handleText = () => {
    if (canvas) {
      setTool('text');
      import('fabric').then((fabricModule) => {
        const fabric = fabricModule.default || fabricModule;
        const text = new fabric.Textbox('Text Here', {
          left: 50,
          top: 50,
          fontSize: 20,
        });
        canvas.add(text);
      });
    }
  };

  const clearCanvas = () => {
    if (canvas) canvas.clear();
  };

  return (
    <div className='p-4 '>
      <div className='flex items-center gap-3'>
 <img
              src={logo || "/placeholder.svg"}
              alt="EduKARI Logo"
              className="h-16 w-auto rounded-full shadow-lg shadow-black"
            />
        <h1 className='text-2xl font-bold'>EduKARI</h1>
      </div>
      <h2 className="text-black text-3xl font-bold text-center mt-4">Board</h2>
      <div className='flex flex-col items-center mt-4'>
        <div className="flex gap-2">
          <button className="text-3xl p-2" onClick={() => handleToolChange('brush', 5)}>✒️</button>
          <button className="text-3xl p-2" onClick={() => handleToolChange('pencil', 2)}>✏️</button>
          <button className="text-3xl p-2" onClick={() => handleToolChange('eraser', 20)}>🧽</button>
          <button className="text-3xl p-2" onClick={clearCanvas}>🪄</button>
          <button>
            <input
              type="color"
              className='w-8 h-8 border'
              value={color}
              onChange={(e) => {
                setColor(e.target.value);
                if (canvas && tool !== 'eraser') {
                  canvas.freeDrawingBrush.color = e.target.value;
                }
              }}
            />
          </button>
          <button onClick={handleStartCall}>🟢</button>
          <button onClick={handleEndCall}>🔴</button>
          <button onClick={startScreenRecording}>🎥</button>
          <button onClick={stopScreenRecording}>🚫</button>
        </div>
        <video id="localVideo" autoPlay muted className=" w-32 h-24 inline-block rounded-lg"></video>
        <video id="remoteVideo" autoPlay className="rounded-full w-1 h-1 mt-2 inline-block align-top"></video>
        <canvas ref={canvasRef} width="1600" height="800" className=" border"></canvas>
      </div>
    </div>
  );
};

export default StreamBoard;
