import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { useSelector } from 'react-redux';
import { getSessionById, submitReview, completeSession, startCallSession } from '../api/api';
import { io } from 'socket.io-client';

const VideoCallPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inCall, setInCall] = useState(false);
  const [callActive, setCallActive] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const clientRef = useRef(null);
  const localTrackRef = useRef(null);
  const remoteTrackRef = useRef(null);
  const socketRef = useRef(null);

  const APP_ID = '2cbcbf75df414ab28859f21bc19a34bf';
  const CHANNEL_NAME = `session-${id}`;
  const TOKEN = null;

  useEffect(() => {
    if (!clientRef.current) {
      clientRef.current = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
      console.log('AgoraRTC client initialized');
    }

    socketRef.current = io('http://localhost:5000');
    socketRef.current.on('connect', () => {
      console.log('Connected to Socket.IO server');
      socketRef.current.emit('joinSession', id);
    });

    socketRef.current.on('callStatusUpdate', ({ callStatus }) => {
      console.log('Received callStatusUpdate:', callStatus);
      setCallActive(callStatus === 'active');
    });

    const fetchSession = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getSessionById(id);
        const fetchedSession = response.data;
        console.log('Fetched session in useEffect:', fetchedSession);

        if (!user) {
          throw new Error('You must be logged in to join the session.');
        }
        if (
          fetchedSession.studentId._id !== user._id &&
          fetchedSession.tutorId._id !== user._id
        ) {
          throw new Error('You are not authorized to join this session.');
        }

        if (fetchedSession.status !== 'confirmed') {
          throw new Error('This session is not confirmed yet.');
        }

        const now = new Date();
        const sessionStart = new Date(fetchedSession.startTime);
        const sessionEnd = new Date(fetchedSession.endTime);
        const gracePeriod = 15 * 60 * 1000;
        const startWindow = new Date(sessionStart.getTime() - gracePeriod);
        const endWindow = new Date(sessionEnd.getTime() + gracePeriod);
        console.log('Time check:', { now: now.toISOString(), start: startWindow.toISOString(), end: endWindow.toISOString() });

        if (now < startWindow || now > endWindow) {
          throw new Error('This session is not currently active.');
        }

        setSession(fetchedSession);
        setCallActive(fetchedSession.callStatus === 'active');
      } catch (err) {
        console.error('Error fetching session:', err);
        setError(err.response?.data?.error || err.message || 'Failed to load session');
      } finally {
        setLoading(false);
      }
    };

    fetchSession();

    return () => {
      if (clientRef.current) {
        clientRef.current.leave();
        console.log('Client cleaned up on unmount');
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log('Socket.IO disconnected');
      }
      if (localTrackRef.current) {
        localTrackRef.current[0]?.close();
        localTrackRef.current[1]?.close();
        localTrackRef.current = null;
      }
    };
  }, [id, user]);

  useEffect(() => {
    if (inCall && localVideoRef.current && localTrackRef.current?.[1]) {
      localVideoRef.current.srcObject = new MediaStream([localTrackRef.current[1].getMediaStreamTrack()]);
      console.log('Local video stream set');
    }
  }, [inCall]);

  useEffect(() => {
    if (inCall && remoteVideoRef.current && remoteTrackRef.current) {
      remoteTrackRef.current.play(remoteVideoRef.current);
      console.log('Remote video stream set and played');
    }
  }, [inCall, remoteTrackRef.current]);

  const startCall = async () => {
    try {
      const client = clientRef.current;
      console.log('Starting call with App ID:', APP_ID, 'Channel:', CHANNEL_NAME, 'User ID:', user._id);

      if (client.connectionState === 'CONNECTED' || client.connectionState === 'CONNECTING') {
        console.log('Client already connected, leaving first');
        await client.leave();
      }

      await client.join(APP_ID, CHANNEL_NAME, TOKEN, user._id);
      console.log('Joined Agora channel successfully');

      let tracks;
      try {
        tracks = await AgoraRTC.createMicrophoneAndCameraTracks();
        console.log('Local tracks created:', {
          audioTrack: tracks[0],
          videoTrack: tracks[1],
        });
      } catch (err) {
        console.error('Error creating tracks:', err);
        setError('Failed to access camera/microphone: ' + err.message);
        await client.leave();
        return;
      }

      await client.publish(tracks);
      console.log('Local tracks published');

      localTrackRef.current = tracks;

      client.on('user-published', async (remoteUser, mediaType) => {
        console.log('Remote user published:', {
          userId: remoteUser.uid,
          mediaType,
          hasVideo: remoteUser.hasVideo,
        });
        try {
          await client.subscribe(remoteUser, mediaType);
          console.log('Subscribed to remote user:', remoteUser.uid, 'Media Type:', mediaType);
          if (mediaType === 'video') {
            remoteTrackRef.current = remoteUser.videoTrack;
            if (remoteTrackRef.current) {
              console.log('Remote video track updated:', remoteTrackRef.current);
            } else {
              console.warn('No remote video track available');
            }
          }
        } catch (err) {
          console.error('Error subscribing to remote user:', err);
          setError('Failed to subscribe to remote video: ' + err.message);
        }
      });

      client.on('user-unpublished', (remoteUser) => {
        console.log('Remote user unpublished:', remoteUser.uid);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = null;
        }
        remoteTrackRef.current = null;
        getSessionById(id).then(response => {
          setCallActive(response.data.callStatus === 'active');
        });
      });

      client.on('user-joined', (remoteUser) => {
        console.log('User joined:', remoteUser.uid);
      });

      client.on('user-left', (remoteUser, reason) => {
        console.log('User left:', remoteUser.uid, 'Reason:', reason);
      });

      if (!callActive) {
        await startCallSession(id);
        setCallActive(true);
      }

      setInCall(true);
    } catch (err) {
      console.error('Error starting video call:', err);
      setError('Failed to start video call: ' + err.message);
    }
  };

  const endCall = async () => {
    try {
      console.log('Ending call for user:', user._id, 'Role:', user.role);
      if (localTrackRef.current) {
        localTrackRef.current[0]?.close();
        localTrackRef.current[1]?.close();
        console.log('Local tracks closed');
        localTrackRef.current = null;
      }
      if (clientRef.current) {
        await clientRef.current.leave();
        console.log('Left Agora channel');
      }
      setInCall(false);
      setCallActive(false);

      const response = await getSessionById(id);
      const updatedSession = response.data;
      console.log('Session details before completing:', {
        status: updatedSession.status,
        callStatus: updatedSession.callStatus,
        studentId: updatedSession.studentId._id,
        tutorId: updatedSession.tutorId._id,
        studentConfirmed: updatedSession.studentConfirmed,
        tutorConfirmed: updatedSession.tutorConfirmed,
      });

      if (user.role === 'tutor') {
        if (updatedSession.status === 'completed') {
          console.log('Session already marked as completed, proceeding to next step');
        } else if (updatedSession.status !== 'confirmed') {
          throw new Error(`Session cannot be marked as completed. Current status: ${updatedSession.status}`);
        } else {
          await completeSession(id);
          console.log('Session marked as completed');
        }
      }

      if (user.role === 'student' && session.studentId._id === user._id) {
        if (updatedSession.status === 'completed') {
          setShowReviewForm(true);
        } else {
          console.log('Session not yet completed, waiting for tutor to end the session');
          navigate('/my-sessions', { state: { message: 'Video call ended. Waiting for tutor to mark the session as completed.' } });
        }
      } else {
        navigate('/my-sessions', { state: { message: 'Video call ended.' } });
      }
    } catch (err) {
      console.error('Error ending video call:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      setError('Failed to end video call: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting review for session:', id, 'by user:', { id: user._id, role: user.role, sessionStudentId: session?.studentId._id });
      if (user.role !== 'student' || session.studentId._id !== user._id) {
        throw new Error('Only the student can submit a review for this session');
      }
      const response = await submitReview({ sessionId: id, rating, comment });
      console.log('Review submission response:', response);
      setReviewSubmitted(true);
      setTimeout(() => {
        navigate('/my-sessions', { state: { message: 'Video call ended and review submitted.' } });
      }, 2000);
    } catch (err) {
      console.error('Error submitting review:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        userId: user._id,
        userRole: user.role,
      });
      setError('Failed to submit review: ' + (err.response?.data?.error || err.message));
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-700">Loading session...</div>;
  }

  if (error || !session) {
    return (
      <div className="p-6 text-center text-red-600 font-semibold">
        {error || 'Session not found.'}
      </div>
    );
  }

  if (showReviewForm && !reviewSubmitted) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Rate Your Session: {session.subject}
        </h1>
        <div className="bg-white shadow-lg rounded-lg p-6 space-y-4">
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Rating (1-5 stars)</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-2xl ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-2 border rounded-md"
                rows="4"
                placeholder="Share your feedback..."
                required
              />
            </div>
            <button
              type="submit"
              className="py-2 px-4 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg transition"
            >
              Submit Review
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (reviewSubmitted) {
    return (
      <div className="p-6 text-center text-green-600 font-semibold">
        Review submitted successfully! Redirecting...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Video Call: {session.subject}
      </h1>
      <div className="bg-white shadow-lg rounded-lg p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p><strong>Tutor:</strong> {session.tutorId.name}</p>
            <p><strong>Student:</strong> {session.studentId.name}</p>
            <p><strong>Time:</strong> {new Date(session.startTime).toLocaleString()} - {new Date(session.endTime).toLocaleString()}</p>
          </div>
          <div>
            {!inCall ? (
              <button
                onClick={startCall}
                className="py-2 px-4 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-lg transition"
              >
                {callActive ? 'Join Call' : 'Start Call'}
              </button>
            ) : (
              <button
                onClick={endCall}
                className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
              >
                End Call
              </button>
            )}
          </div>
        </div>

        {inCall && (
          <div className="relative">
            <div className="w-full h-96 bg-black rounded">
              <h2 className="text-lg font-semibold text-white p-2">Remote Video</h2>
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover rounded"
              />
            </div>
            {localTrackRef.current?.[1] && (
              <div className="absolute bottom-4 right-4 w-32 h-24 bg-black rounded shadow-lg">
                <h2 className="text-sm font-semibold text-white p-1">You</h2>
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-16 object-cover rounded"
                />
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCallPage;