import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
// import Canvas from "./Canvas";
import rough from "roughjs"
import Whiteboard from "../../components/Whiteboard/Whiteboard";
import Chat from "../../components/ChatBar/ChatBar"
const roughGenerator = rough.generator();
const RoomPage = ({ userNo, socket, setUsers, setUserNo, user, users}) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [color, setColor] = useState("#000000");
  const [elements, setElements] = useState([]);
  const [history, setHistory] = useState([]);
  const [tool, setTool] = useState("pencil");
  const [openedUserTab, setOpenedUserTab] = useState(false);
  const [openedChatTab, setOpenedChatTab] = useState(false);

  // useEffect(() => {
  //   return ()=>{
  //     socket.emit("userLeft", user)
  //   };
  // }, []);
  //   useEffect(() => {
    //     socket.on("users", (data) => {
      //       setUsers(data);
      //       setUserNo(data.length);
      //     });
      //   }, []);
      
      // socket.on("message", (data) => {
      //   toast.info(data.message);
      // });
      
      
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    setElements([]);
  };

  const undo = () => {
    setHistory((prevHistory) => [
      ...prevHistory,
      elements[elements.length - 1],
    ]);
    setElements((prevElements) =>
      prevElements.filter((ele, index) => index !== elements.length - 1)
    );
  };
  const redo = () => {
    setElements((prevElements) => [
      ...prevElements,
      history[history.length - 1],
    ]);
    setHistory((prevHistory) =>
      prevHistory.filter((ele, index) => index !== history.length - 1)
    );
  };
  console.log("ntsee",users)
  return (
    <div className="container-fluid">
      <div className="row">
        <button onClick={()=>setOpenedUserTab(true)} type="button" className="btn btn-dark" style={{display:"block",position:"absolute",top:"5%",left:"5%",height:"40px",width:"100px"}}>Users</button>
        <button onClick={()=>setOpenedChatTab(true)} type="button" className="btn btn-primary" style={{display:"block",position:"absolute",top:"5%",left:"15%",height:"40px",width:"100px"}}>Chats</button>
        {openedUserTab && (
          <div className="position-fixed top-0 h-100 text-white bg-dark" style={{width:"250px",left:"0%"}}>
            <button type="button" className="btn btn-light" onClick={()=>{setOpenedUserTab(false)}}  style={{display:"block",position:"absolute",top:"5%",left:"25%",height:"40px",width:"100px"}}>Close</button>
            <div className="w-100 mt-5 pt-5">
              {users.map((usr,index)=>(
                <p key={index*99} className="my-2 text-center w-100">
                  {usr.name} {user.name && user.userId === usr.userId && "(You)"} {usr.host?"(Host)":""}
                </p>
              ))}
            </div>
          </div>
        )}
        {openedChatTab && (
          <Chat setOpenedChatTab={setOpenedChatTab} socket={socket}/>
        )}
        <h1 className="display-5 pt-4 pb-3 text-center">
          React Drawing App - users online:{users?.length}
        </h1>
      </div>
      {user?.presenter && <div className="row justify-content-center align-items-center text-center py-2">
        <div className="col-md-2">
          <div className="color-picker d-flex align-items-center justify-content-center">
            Color Picker : &nbsp;
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="tools"
              id="pencil"
              value="pencil"
              checked={tool === "pencil"}
              onClick={(e) => setTool(e.target.value)}
              readOnly={true}
            />
            <label className="form-check-label" htmlFor="pencil">
              Pencil
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="tools"
              id="line"
              value="line"
              checked={tool === "line"}
              onClick={(e) => setTool(e.target.value)}
              readOnly={true}
            />
            <label className="form-check-label" htmlFor="line">
              Line
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="tools"
              id="rect"
              value="rect"
              checked={tool === "rect"}
              onClick={(e) => setTool(e.target.value)}
              readOnly={true}
            />
            <label className="form-check-label" htmlFor="rect">
              Rectangle
            </label>
          </div>
        </div>

        <div className="col-md-2">
          <button
            type="button"
            className="btn btn-outline-primary"
            disabled={elements.length === 0}
            onClick={() => undo()}
          >
            Undo
          </button>
          &nbsp;&nbsp;
          <button
            type="button"
            className="btn btn-outline-primary ml-1"
            disabled={history.length < 1}
            onClick={() => redo()}
          >
            Redo
          </button>
        </div>
        <div className="col-md-1">
          <div className="color-picker d-flex align-items-center justify-content-center">
            <input
              type="button"
              className="btn btn-danger"
              value="clear canvas"
              onClick={clearCanvas}
            />
          </div>
        </div>
      </div>}
      <div className="row">
        {/* {JSON.stringify(elements)} */}
        <Whiteboard
          canvasRef={canvasRef}
          ctxRef={ctxRef}
          color={color}
          setElements={setElements}
          elements={elements}
          tool={tool}
          socket={socket}
          user={user}
          users={users}
        />
      </div>
    </div>
  );
};

export default RoomPage;