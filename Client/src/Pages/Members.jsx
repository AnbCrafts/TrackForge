import React, { useContext, useEffect, useState, useRef } from "react";
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";
import { useParams, Link } from "react-router-dom";
import {
  User,
  Search,
  UserPlus,
  Mail,
  Shield,
  CircleDot,
  Send,
  MessageSquare,
  Calendar
} from "lucide-react";
import CreateMemberModal from "../Components/CreateMemberModal";
import CreateMeetingRoomModal from "../Components/CreateMeetingRoomModal";
import { motion } from "framer-motion";
import axios from "axios";
import { io } from "socket.io-client";

export default function Members() {
  const { allUserProfiles, searchUserProfiles, serverURL, authUserData, getUserDataById } = useContext(TrackForgeContextAPI);
  const { hash, username } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);

  // Direct Messaging States
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);

  const messagesEndRef = useRef(null);
  const myUserId = localStorage.getItem("userId");

  // Load all user profiles created by the current admin on mount
  useEffect(() => {
    searchUserProfiles("");
  }, [hash, authUserData]);

  // Load current user profile details if not present
  useEffect(() => {
    if (!authUserData) {
      const id = localStorage.getItem("userId");
      if (id) getUserDataById(id);
    }
  }, [authUserData]);

  // Intercept and parse meeting links inside message content
  const renderMessageContent = (content) => {
    if (!content) return "";
    const meetingRoomRegex = /\/workspace\/meeting-room\/([a-f0-9]+)/;
    if (meetingRoomRegex.test(content)) {
      const parts = content.split(/(\/workspace\/meeting-room\/[a-f0-9]+)/);
      return parts.map((part, i) => {
        const match = part.match(/\/workspace\/meeting-room\/([a-f0-9]+)/);
        if (match) {
          const roomId = match[1];
          const fullPath = `/auth/${hash}/${username}/workspace/meeting-room/${roomId}`;
          return (
            <Link
              key={i}
              to={fullPath}
              className="underline text-yellow-300 hover:text-yellow-100 font-extrabold transition-colors mx-1"
            >
              Join Meeting Room
            </Link>
          );
        }
        return part;
      });
    }
    return content;
  };

  // Connect to Socket.io server
  useEffect(() => {
    if (!serverURL) return;
    const newSocket = io(serverURL);
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [serverURL]);

  // Join room and load direct messages when selected user changes
  useEffect(() => {
    if (!socket || !selectedUser || !myUserId) return;

    // Direct message room unique name
    const ids = [myUserId, selectedUser._id].sort();
    const roomName = `dm_${ids[0]}_${ids[1]}`;

    socket.emit("join_room", roomName);

    // Fetch conversation history
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${serverURL}/message/${myUserId}/${selectedUser._id}`);
        if (response.data.success) {
          setMessages(response.data.messages || []);
        }
      } catch (err) {
        console.error("Error loading chat messages:", err);
      }
    };

    fetchMessages();

    // Listen for incoming messages
    socket.on("receive_message", (messageData) => {
      // Append only if it is from/to the currently active user chat
      if (messageData.sender === selectedUser._id || messageData.receiver === selectedUser._id) {
        setMessages((prev) => [...prev, messageData]);
      }
    });

    return () => {
      socket.off("receive_message");
    };
  }, [socket, selectedUser, myUserId, serverURL]);

  // Auto scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    searchUserProfiles(term);
  };

  const getInitials = (user) => {
    const first = user.firstName ? user.firstName.charAt(0) : "";
    const last = user.lastName ? user.lastName.charAt(0) : "";
    return (first + last).toUpperCase();
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser || !myUserId) return;

    const content = newMessage.trim();
    setNewMessage("");

    // Optimistically update message state
    const optimisticMsg = {
      sender: myUserId,
      receiver: selectedUser._id,
      content,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      const response = await axios.post(`${serverURL}/message/send`, {
        sender: myUserId,
        receiver: selectedUser._id,
        content,
      });

      if (response.data.success && socket) {
        const ids = [myUserId, selectedUser._id].sort();
        const roomName = `dm_${ids[0]}_${ids[1]}`;

        // Broadcast through socket.io
        socket.emit("send_message", {
          room: roomName,
          sender: myUserId,
          receiver: selectedUser._id,
          content,
          createdAt: response.data.messageData.createdAt,
        });
      }
    } catch (err) {
      console.error("Error sending chat message:", err);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-primary text-primary">
      {/* HEADER ACTION BAR */}
      <div className="p-5 flex items-center justify-between gap-5 flex-wrap w-full bg-card border border-default rounded-2xl shadow-xl mb-8">
        <div className="flex items-center gap-3">
          <User className="h-7 w-7 text-neon" />
          <h1 className="text-2xl font-bold text-primary">Manage Team Members</h1>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          {/* Schedule Meeting Button */}
          {(authUserData?.role === "Owner" || authUserData?.role === "Admin") && (
            <button
              onClick={() => setIsMeetingModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-secondary border border-default text-primary rounded-xl shadow-md hover:bg-hover font-bold transition-all transform hover:-translate-y-0.5 cursor-pointer text-sm"
            >
              <Calendar className="h-4 w-4 text-neon" />
              <span>Schedule Meeting</span>
            </button>
          )}

          {/* Add Member Button */}
          {(authUserData?.role === "Owner" || authUserData?.role === "Admin") && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 btn-gradient text-white rounded-xl shadow-md hover:shadow-lg font-bold transition-all transform hover:-translate-y-0.5 cursor-pointer text-sm"
            >
              <UserPlus className="h-4 w-4" />
              <span>Add Member</span>
            </button>
          )}
        </div>
      </div>

      {/* TWO PART DUAL-PANE LAYOUT */}
      <div className="flex flex-col lg:flex-row gap-6 items-stretch min-h-[70vh]">
        {/* LEFT COLUMN: Members Sidebar */}
        <div className="w-full lg:w-96 bg-card border border-default rounded-2xl p-4 flex flex-col shadow-lg">
          <div className="flex relative items-center gap-2 w-full mb-4">
            <input
              value={searchTerm}
              onChange={handleSearchChange}
              type="search"
              className="outline-none border rounded-xl shadow-sm focus:ring-2 focus:ring-[var(--border-neon)]/50 border-default px-4 py-2 w-full bg-secondary text-primary text-sm"
              placeholder="Search members by name/email..."
            />
            <Search className="absolute right-3 h-4 w-4 text-neon pointer-events-none" />
          </div>

          <div className="flex-1 overflow-y-auto noScroll max-h-[60vh] space-y-2 pr-1">
            {allUserProfiles && allUserProfiles.length > 0 ? (
              allUserProfiles.map((user) => (
                <div
                  key={user._id}
                  onClick={() => setSelectedUser(user)}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition border ${
                    selectedUser?._id === user._id
                      ? "bg-secondary border-[var(--border-neon)]/30"
                      : "border-transparent hover:bg-secondary/45"
                  }`}
                >
                  {/* User Profile Avatar */}
                  <div className="relative shrink-0">
                    {user.picture ? (
                      <img
                        src={user.picture}
                        alt={user.firstName}
                        className="h-11 w-11 rounded-xl object-cover ring-2 ring-default/20"
                      />
                    ) : (
                      <div className="h-11 w-11 rounded-xl bg-purple-500/10 flex items-center justify-center font-bold text-neon shadow-inner text-sm">
                        {getInitials(user)}
                      </div>
                    )}
                    <span className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-[var(--bg-card)] ${
                      user.status === "Online" || user.status === "online"
                        ? "bg-green-500"
                        : "bg-gray-400"
                    }`} />
                  </div>

                  {/* User Identity */}
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-xs text-primary truncate">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-[10px] text-muted truncate">@{user.username}</div>
                    <div className="text-[10px] text-muted truncate">{user.email}</div>
                  </div>

                  {/* User Role Badge */}
                  <span className="px-2.5 py-0.5 bg-secondary/80 text-secondary border border-default rounded-full text-[9px] font-bold shrink-0">
                    {user.role}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted text-xs">No team members found</div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Chat Panel */}
        <div className="flex-1 bg-card border border-default rounded-2xl shadow-lg flex flex-col overflow-hidden min-h-[500px]">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-default bg-secondary/20 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {/* Selected User Avatar */}
                  <div className="relative">
                    {selectedUser.picture ? (
                      <img
                        src={selectedUser.picture}
                        alt={selectedUser.firstName}
                        className="h-10 w-10 rounded-xl object-cover ring-2 ring-default/20"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center font-bold text-neon text-sm">
                        {getInitials(selectedUser)}
                      </div>
                    )}
                    <span className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[var(--bg-card)] ${
                      selectedUser.status === "Online" || selectedUser.status === "online"
                        ? "bg-green-500"
                        : "bg-gray-400"
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-primary">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] text-muted">
                      <span>@{selectedUser.username}</span>
                      <span>•</span>
                      <span className="font-bold text-neon uppercase">{selectedUser.role}</span>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-muted font-semibold bg-secondary/50 border border-default px-2.5 py-1 rounded-md">
                  Direct Messages
                </div>
              </div>

              {/* Chat Messages Log */}
              <div className="flex-1 p-4 overflow-y-auto noScroll max-h-[50vh] space-y-3 bg-secondary/5">
                {messages && messages.length > 0 ? (
                  messages.map((msg, index) => {
                    const isMine = msg.sender === myUserId;
                    return (
                      <div
                        key={index}
                        className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`max-w-[70%] px-3.5 py-2 rounded-2xl text-xs shadow-sm leading-relaxed ${
                            isMine
                              ? "btn-gradient text-white rounded-tr-none font-medium"
                              : "bg-secondary text-primary rounded-tl-none border border-default/40"
                          }`}
                        >
                          {renderMessageContent(msg.content)}
                        </div>
                        <span className="text-[9px] text-muted mt-1 px-1 font-mono">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex items-center justify-center text-center p-8 text-muted text-xs">
                    No messages yet. Send a message to start the conversation!
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Message Input Field */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-default bg-secondary/15 flex items-center gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Send message to ${selectedUser.firstName}...`}
                  className="flex-1 outline-none border rounded-xl focus:ring-2 focus:ring-[var(--border-neon)]/50 border-default px-4 py-2.5 bg-card text-primary text-xs"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="p-2.5 btn-gradient text-white rounded-xl shadow hover:opacity-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted p-8 text-center bg-secondary/5">
              <MessageSquare className="w-16 h-16 text-muted/30 mb-4" />
              <h3 className="text-sm font-bold text-primary mb-1">Select a Member</h3>
              <p className="text-xs text-muted max-w-xs">
                Choose a developer, tester, or teammate from the list to view details and start chatting.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Creation Modal */}
      <CreateMemberModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          searchUserProfiles(searchTerm); // Refresh list
        }}
      />

      {/* Meeting Room Modal */}
      <CreateMeetingRoomModal
        isOpen={isMeetingModalOpen}
        onClose={() => setIsMeetingModalOpen(false)}
      />
    </div>
  );
}
