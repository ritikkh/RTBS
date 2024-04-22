import { useEffect, useState} from "react";
import Forms from "./components/Forms/Forms";
import RoomPage from "./pages/RoomPage/RoomPage";
import { Routes, Route } from "react-router-dom";
import io from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";

const server = "http://localhost:5000";
const connectionOptions = {
  "force new connection": true,
  reconnectionAttempts: "Infinity",
  timeout: 10000,
  transports: ["websocket"],
};
const socket = io(server, connectionOptions);
function App() {
    const [userNo, setUserNo] = useState(0);
    const [roomJoined, setRoomJoined] = useState(false);
    const [user, setUser] = useState({});
    const [users, setUsers] = useState([]);
    const [chat, setChat] = useState([]);

    
  const uuid = () => {
    var S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (
      S4() +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      S4() +
      S4()
    );
  };

  useEffect(()=>{
    socket.on("userIsJoined", (data)=>{
      if(data.success){
        setUsers(data.users);
      }
      else{
        console.log("userjoined error")
      }
    })
    socket.on("allUsers", (data)=>{
      setUsers(data);
    })
    socket.on("userJoinedMessageBroadcasted",(data)=>{
      console.log("toastjoinmessage",data)
      toast.info(`${data} joined the room`)
    })
    socket.on("userLeftMessageBroadcasted",(data)=>{
      console.log("toastLeftmessage",data)
      toast.info(`${data} left the room`)
    })
  },[user])

  return (
    <div className="container">
      <ToastContainer/>
      <Routes>
        <Route path="/" element={<Forms uuid={uuid} socket={socket} setUser={setUser}/>}></Route>
        <Route path="/:roomid" element={<RoomPage user={user} users={users} socket={socket} chat={chat} setChat={setChat}/>}></Route>
      </Routes>
    </div>
  );
}

export default App;
