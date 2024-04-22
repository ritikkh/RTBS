import React, { useEffect, useState } from 'react'

const ChatBar = ({setOpenedChatTab, socket}) => {
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  useEffect(()=>{
    socket.on("messageResponse",(data)=>{
      setChat((prev)=>[...prev, data])
    })
  },[])
  const handlesubmit=(e)=>{
    e.preventDefault();
    console.log("immessagechat",message,chat)
    if(message.trim()!==""){
    socket.emit("message",{message})
    setChat((prev)=>[...prev, {message, name:"You"}])
    setMessage("")
    }
  }
  return (
    <div className="position-fixed top-0 h-100 text-white bg-dark" style={{width:"400px",left:"0%", justifyContent: "end", display: "flex", flexDirection: "column"}}>
            <button type="button" className="btn btn-light" onClick={()=>{setOpenedChatTab(false)}}  style={{display:"block",position:"absolute",top:"5%",left:"25%",height:"40px",width:"100px"}}>Close</button>
            <div className="w-100 mt-5 p-2 border border-1 border-white rounded-3" style={{height:"70%"}}>
            {chat && chat.map((msg,index)=>(
                <p key={index*99} className="my-2 text-center w-100 py-2 border border-left-0 border-right-0">
                  {msg.name}: {msg.message}
                </p>
              ))}
            </div>
            <form onSubmit={handlesubmit} className='w-100 mt-4 d-flex rounded-3'>
              <input type="text" placeholder='Enter Message' className='h-100 border-0 py-2 px-4' style={{width:"90%"}} value={message} onChange={(e)=>setMessage(e.target.value)}/>
              <button type="submit" className="btn btn-primary rounded-0" onClick={()=>{}}>Send</button>
            </form>
          </div>
  )
}

export default ChatBar