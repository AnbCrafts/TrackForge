import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";
import {
  ArrowLeft,
  Calendar,
  Lock,
  Unlock,
  Paperclip,
  Send,
  Image,
  FileText,
  Download,
  Users,
  FolderKanban,
  Clock,
  Shield,
  X,
  File
} from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { io } from "socket.io-client";

export default function MeetingRoom() {
  const { roomId, hash, username } = useParams();
  const navigate = useNavigate();
  const { serverURL, authUserData, getUserDataById } = useContext(TrackForgeContextAPI);
  const myUserId = localStorage.getItem("userId");

  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // File Upload State
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Load user data if not present
  useEffect(() => {
    if (!authUserData && myUserId) {
      getUserDataById(myUserId);
    }
  }, [authUserData, myUserId]);

  // Load meeting room details and message log on mount
  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        setIsLoading(true);
        const detailsRes = await axios.get(`${serverURL}/meeting/details/${roomId}`);
        if (detailsRes.data.success) {
          const roomObj = detailsRes.data.room;
          setRoom(roomObj);

          // Verify permission
          const isCreator = roomObj.creator?._id === myUserId;
          const isAdminOrOwner = authUserData?.role === "Owner" || authUserData?.role === "Admin";
          const isInvitedUser = roomObj.users?.some((u) => (u._id || u).toString() === myUserId);
          const isInvitedTeamMember = roomObj.teams?.some((team) => 
            team.members?.some((m) => {
              const pId = m.participant?._id || m.participant;
              return pId && pId.toString() === myUserId;
            })
          );
          const isInvitedProjectMember = roomObj.projectId?.members?.some((mId) => 
            mId && (mId._id || mId).toString() === myUserId
          );

          if (isCreator || isAdminOrOwner || isInvitedUser || isInvitedTeamMember || isInvitedProjectMember) {
            setIsAuthorized(true);
          } else {
            setIsAuthorized(false);
          }

          // Fetch message history
          const messagesRes = await axios.get(`${serverURL}/meeting/messages/${roomId}`);
          if (messagesRes.data.success) {
            setMessages(messagesRes.data.messages || []);
          }
        } else {
          toast.error("Meeting room not found.");
        }
      } catch (err) {
        console.error("Error loading meeting room details:", err);
        toast.error("Failed to load meeting details.");
      } finally {
        setIsLoading(false);
      }
    };

    if (roomId && serverURL && authUserData) {
      fetchRoomDetails();
    }
  }, [roomId, serverURL, authUserData, myUserId]);

  // Connect to Socket.io server
  useEffect(() => {
    if (!serverURL || !roomId || !isAuthorized) return;
    
    const socketConn = io(serverURL);
    setSocket(socketConn);

    const roomName = `meeting_${roomId}`;
    socketConn.emit("join_room", roomName);

    socketConn.on("receive_message", (messageData) => {
      setMessages((prev) => [...prev, messageData]);
    });

    return () => {
      socketConn.off("receive_message");
      socketConn.close();
    };
  }, [serverURL, roomId, isAuthorized]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary text-primary">
        <p className="text-center text-muted animate-pulse">Entering Scheduled Event Room...</p>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary text-primary p-6">
        <div className="bg-card border border-default rounded-2xl p-8 max-w-md text-center shadow-xl">
          <Shield className="h-14 w-14 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Meeting Not Found</h2>
          <p className="text-xs text-muted mb-6">This scheduled event room does not exist or has been deleted.</p>
          <Link to={`/auth/${hash}/${username}/workspace/dashboard`} className="px-5 py-2.5 btn-gradient text-white rounded-xl text-xs font-bold shadow-md hover:opacity-90 inline-block">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary text-primary p-6">
        <div className="bg-card border border-default rounded-2xl p-8 max-w-md text-center shadow-xl">
          <Shield className="h-14 w-14 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p className="text-xs text-muted mb-6">You do not have a join pass for this scheduled meeting. Please request an invitation from the owner/admin.</p>
          <Link to={`/auth/${hash}/${username}/workspace/dashboard`} className="px-5 py-2.5 btn-gradient text-white rounded-xl text-xs font-bold shadow-md hover:opacity-90 inline-block">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Scheduled date validation
  const meetingDate = new Date(room.scheduledDate);
  const isEventDate = new Date().toDateString() === meetingDate.toDateString();

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check size limit: 10MB
    if (file.size > 10 * 1024 * 1024) {
      toast.warn("File is too large. Max limit is 10MB.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${serverURL}/meeting/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        setUploadedFile({
          mediaUrl: response.data.mediaUrl,
          mediaType: response.data.mediaType,
          filename: response.data.filename,
          size: response.data.size,
        });
        toast.success("Attachment uploaded successfully!");
      } else {
        toast.error("Upload failed.");
      }
    } catch (err) {
      console.error("File upload error:", err);
      toast.error("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!isEventDate) {
      toast.warn("Messaging is only active on the scheduled meeting date.");
      return;
    }

    if (!newMessage.trim() && !uploadedFile) return;

    const payload = {
      sender: myUserId,
      content: newMessage.trim(),
      mediaUrl: uploadedFile?.mediaUrl || null,
      mediaType: uploadedFile?.mediaType || null,
      filename: uploadedFile?.filename || null,
      size: uploadedFile?.size || null,
    };

    try {
      const response = await axios.post(`${serverURL}/meeting/messages/${roomId}/send`, payload);

      if (response.data.success) {
        const savedMsg = response.data.messageData;

        // Broadcast to socket room
        if (socket) {
          socket.emit("send_message", {
            room: `meeting_${roomId}`,
            ...savedMsg,
          });
        }

        // Append locally
        setMessages((prev) => [...prev, savedMsg]);

        // Reset inputs
        setNewMessage("");
        setUploadedFile(null);
      }
    } catch (err) {
      console.error("Send message error:", err);
      toast.error("Failed to send message.");
    }
  };

  const formatSize = (bytes) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const getInitials = (user) => {
    if (!user) return "";
    const first = user.firstName ? user.firstName.charAt(0) : "";
    const last = user.lastName ? user.lastName.charAt(0) : "";
    return (first + last).toUpperCase();
  };

  return (
    <div className="min-h-screen p-6 bg-primary text-primary flex flex-col h-[100vh]">
      {/* EVENT HEADER */}
      <div className="p-4 bg-card border border-default rounded-2xl shadow-xl flex items-center justify-between gap-4 mb-5 flex-wrap shrink-0">
        <div className="flex items-center gap-3.5">
          <Link
            to={`/auth/${hash}/${username}/workspace/dashboard`}
            className="p-2 bg-secondary hover:bg-hover border border-default rounded-xl transition cursor-pointer text-muted hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-primary flex items-center gap-2">
              <Calendar className="h-5 w-5 text-neon" />
              {room.title}
            </h1>
            <p className="text-[10px] text-muted flex items-center gap-2 mt-0.5">
              <Clock className="h-3.5 w-3.5 text-neon" />
              <span>Event Date: {new Date(room.scheduledDate).toLocaleString()}</span>
              <span>•</span>
              <span className="font-bold text-neon uppercase">Room ID: {room.roomId}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEventDate ? (
            <span className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs font-bold shadow-sm">
              <Unlock className="h-3.5 w-3.5 animate-bounce" />
              <span>Messaging Open</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-3 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full text-xs font-bold shadow-sm">
              <Lock className="h-3.5 w-3.5" />
              <span>Messaging Locked</span>
            </span>
          )}
        </div>
      </div>

      {/* DUAL-PANE BODY */}
      <div className="flex-1 flex flex-col lg:flex-row gap-5 items-stretch overflow-hidden min-h-0">
        
        {/* LEFT COLUMN: ROOM DETAILS & INFO */}
        <div className="w-full lg:w-80 bg-card border border-default rounded-2xl p-5 flex flex-col gap-5 overflow-y-auto noScroll shadow-lg shrink-0">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted mb-2">Meeting Agenda</h2>
            <div className="bg-secondary/20 border border-default rounded-xl p-3 text-xs text-secondary leading-relaxed shadow-inner">
              {room.purpose}
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted mb-2">Organizer</h2>
            <div className="flex items-center gap-3 bg-secondary/10 border border-default rounded-xl p-3 shadow-sm">
              {room.creator?.picture ? (
                <img
                  src={room.creator.picture}
                  alt="creator"
                  className="w-9 h-9 rounded-xl object-cover ring-2 ring-default/20"
                />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center font-extrabold text-neon text-xs">
                  {getInitials(room.creator)}
                </div>
              )}
              <div>
                <p className="text-xs font-bold text-primary">
                  {room.creator?.firstName} {room.creator?.lastName}
                </p>
                <p className="text-[9px] text-muted font-bold text-neon uppercase">
                  {room.creator?.role}
                </p>
              </div>
            </div>
          </div>

          {room.projectId && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted mb-2">Associated Project</h2>
              <div className="flex items-center gap-2 text-xs text-primary font-bold bg-secondary/15 border border-default rounded-xl p-3 shadow-inner">
                <FolderKanban className="h-4 w-4 text-neon" />
                <span>{room.projectId.name}</span>
              </div>
            </div>
          )}

          {/* Invited teams / members lists */}
          {room.teams && room.teams.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted mb-2">Invited Teams</h2>
              <div className="flex flex-wrap gap-1.5">
                {room.teams.map((team) => (
                  <span key={team._id} className="px-2.5 py-1 bg-secondary border border-default rounded-lg text-[10px] font-bold text-secondary flex items-center gap-1">
                    <Users className="h-3 w-3 text-neon" />
                    {team.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {room.users && room.users.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted mb-2">Guests ({room.users.length})</h2>
              <div className="space-y-2 max-h-40 overflow-y-auto noScroll">
                {room.users.map((u) => (
                  <div key={u._id} className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-secondary/40 transition">
                    {u.picture ? (
                      <img src={u.picture} alt="" className="w-6 h-6 rounded-md object-cover" />
                    ) : (
                      <div className="w-6 h-6 rounded-md bg-purple-500/10 flex items-center justify-center font-bold text-[9px] text-neon">
                        {getInitials(u)}
                      </div>
                    )}
                    <span className="text-[11px] font-medium text-primary truncate">
                      {u.firstName} {u.lastName}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: CHAT WINDOW */}
        <div className="flex-1 bg-card border border-default rounded-2xl shadow-lg flex flex-col overflow-hidden min-h-0">
          
          {/* Locked Notification Bar */}
          {!isEventDate && (
            <div className="p-4 bg-yellow-500/10 border-b border-yellow-500/25 text-yellow-300 text-xs flex items-center gap-2.5 font-semibold shrink-0">
              <Lock className="h-4 w-4 text-yellow-300" />
              <span>Messaging is locked. Room chat is only available on the scheduled date: {new Date(room.scheduledDate).toLocaleDateString()}</span>
            </div>
          )}

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto noScroll space-y-4 bg-secondary/5 min-h-0">
            {messages.length > 0 ? (
              messages.map((msg, index) => {
                const isMine = msg.sender?._id === myUserId || msg.sender === myUserId;
                const senderName = msg.sender?.firstName ? `${msg.sender.firstName} ${msg.sender.lastName}` : "User";
                const initials = getInitials(msg.sender);

                return (
                  <div key={index} className={`flex gap-3 items-start max-w-[80%] ${isMine ? "ml-auto flex-row-reverse" : "mr-auto"}`}>
                    
                    {/* User profile picture */}
                    <div className="shrink-0">
                      {msg.sender?.picture ? (
                        <img
                          src={msg.sender.picture}
                          alt=""
                          className="w-8.5 h-8.5 rounded-lg object-cover ring-1 ring-default/20 shadow-sm"
                        />
                      ) : (
                        <div className="w-8.5 h-8.5 rounded-lg bg-purple-500/10 text-[10px] flex items-center justify-center font-extrabold text-neon">
                          {initials}
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      {/* Name, Role & Timestamp header */}
                      <div className={`flex items-center gap-1.5 text-[9px] text-muted ${isMine ? "justify-end" : ""}`}>
                        <span className="font-extrabold text-secondary">{senderName}</span>
                        <span>•</span>
                        <span className="font-bold text-neon uppercase text-[8px] bg-secondary px-1.5 py-0.2 rounded border border-default">
                          {msg.sender?.role || "Developer"}
                        </span>
                        <span>•</span>
                        <span className="font-mono">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>

                      {/* Content Balloon */}
                      <div className={`px-4 py-2.5 rounded-2xl text-xs shadow-sm leading-relaxed ${
                        isMine
                          ? "btn-gradient text-white rounded-tr-none"
                          : "bg-secondary text-primary rounded-tl-none border border-default/45"
                      }`}>
                        {msg.content && <p className="whitespace-pre-wrap">{msg.content}</p>}

                        {/* Media attachment render */}
                        {msg.mediaUrl && (
                          <div className={msg.content ? "mt-2 pt-2 border-t border-white/10" : ""}>
                            {msg.mediaType?.startsWith("image/") ? (
                              <a
                                href={msg.mediaUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="block rounded-lg overflow-hidden border border-white/20 hover:opacity-90 transition-all max-w-xs shadow"
                              >
                                <img src={msg.mediaUrl} alt="uploaded attachment" className="max-h-60 object-cover w-full" />
                              </a>
                            ) : (
                              <a
                                href={msg.mediaUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2.5 bg-black/25 hover:bg-black/40 border border-white/10 rounded-xl p-3 transition max-w-xs shadow"
                              >
                                <FileText className="h-5 w-5 text-neon shrink-0" />
                                <div className="flex-1 min-w-0 text-left">
                                  <p className="text-[11px] font-bold text-white truncate leading-snug">{msg.filename || "Attachment"}</p>
                                  <p className="text-[9px] text-white/60 font-mono mt-0.5">{formatSize(msg.size)}</p>
                                </div>
                                <Download className="h-4 w-4 text-neon shrink-0 ml-1.5" />
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-muted text-xs">
                <Users className="w-12 h-12 text-muted/30 mb-2.5" />
                <h3 className="font-bold text-primary mb-0.5">Welcome to Scheduled Event Room</h3>
                <p className="max-w-xs text-muted text-[11px]">
                  Messaging will sync in real time. Share updates, raise issues, and work together!
                </p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Uploaded File Preview Banner */}
          {uploadedFile && (
            <div className="px-4 py-2 border-t border-default bg-secondary/15 flex items-center justify-between gap-3 shrink-0 animate-in slide-in-from-bottom-2 duration-150">
              <div className="flex items-center gap-2 min-w-0">
                {uploadedFile.mediaType?.startsWith("image/") ? (
                  <Image className="h-4 w-4 text-neon" />
                ) : (
                  <File className="h-4 w-4 text-neon" />
                )}
                <span className="text-xs font-semibold text-primary truncate max-w-xs">
                  {uploadedFile.filename} ({formatSize(uploadedFile.size)})
                </span>
              </div>
              <button
                onClick={() => setUploadedFile(null)}
                className="p-1 rounded-lg hover:bg-secondary text-muted hover:text-primary transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Form Message input bar */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-default bg-secondary/15 flex items-center gap-3 shrink-0">
            {/* Attachment Button */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              disabled={!isEventDate || isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 border border-default bg-secondary hover:bg-hover text-muted hover:text-primary rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
              title="Attach media/file"
            >
              {isUploading ? (
                <span className="w-4 h-4 border-2 border-neon border-t-transparent rounded-full animate-spin block"></span>
              ) : (
                <Paperclip className="h-4 w-4 text-neon" />
              )}
            </button>

            {/* Chat Input */}
            <input
              type="text"
              value={newMessage}
              disabled={!isEventDate}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={
                isEventDate
                  ? "Write a message or raise a conflict update..."
                  : "Meeting room is locked"
              }
              className="flex-1 outline-none border rounded-xl focus:ring-2 focus:ring-[var(--border-neon)]/50 border-default px-4 py-2.5 bg-card text-primary text-xs disabled:opacity-75 disabled:cursor-not-allowed"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!isEventDate || (!newMessage.trim() && !uploadedFile)}
              className="p-2.5 btn-gradient text-white rounded-xl shadow hover:opacity-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
