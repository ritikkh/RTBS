import React, { useEffect, useLayoutEffect, useState } from "react";
import rough from "roughjs/bundled/rough.esm";

const generator = rough.generator();
const Whiteboard = ({
  canvasRef,
  ctxRef,
  color,
  setElements,
  elements,
  tool,
  socket,
  user,
  users
}) => {
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [img, setImg] = useState(null);
  useEffect(()=>{
    socket.on("whiteboardDataResponse",(data)=>{
      setImg(data.imgURL);
    });
  },[])

  useEffect(() => {
    if(user?.presenter){
    const canvas = canvasRef.current;
    canvas.height = window.innerHeight * 2;
    canvas.width = window.innerWidth * 2;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    const context = canvas.getContext("2d");

    context.strokeWidth = 5;
    context.scale(2, 2);
    context.lineCap = "round";
    context.strokeStyle = color;
    context.lineWidth = 5;
    ctxRef.current = context;
  }
  }, []);

  useEffect(() => {
    if(user?.presenter) ctxRef.current.strokeStyle = color;
  }, [color]);

  const handleMouseDown = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;

    if (tool === "pencil") {
      setElements((prevElements) => [
        ...prevElements,
        {
          offsetX,
          offsetY,
          path: [[offsetX, offsetY]],
          stroke: color,
          element: tool,
        },
      ]);
    } else {
      setElements((prevElements) => [
        ...prevElements,
        { offsetX, offsetY, stroke: color, element: tool },
      ]);
    }

    setIsDrawing(true);
  };

  useLayoutEffect(() => {
    if(canvasRef && user?.presenter){
      const roughCanvas = rough.canvas(canvasRef.current);
      if (elements.length > 0) {
        ctxRef.current.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
      }
      elements.forEach((ele, i) => {
        if (ele.element === "rect") {
          roughCanvas.draw(
            generator.rectangle(ele.offsetX, ele.offsetY, ele.width, ele.height, {
              stroke: ele.stroke,
              roughness: 0,
              strokeWidth: 5,
            })
          );
        } else if (ele.element === "line") {
          roughCanvas.draw(
            generator.line(ele.offsetX, ele.offsetY, ele.width, ele.height, {
              stroke: ele.stroke,
              roughness: 0,
              strokeWidth: 5,
            })
          );
        } else if (ele.element === "pencil") {
          roughCanvas.linearPath(ele.path, {
            stroke: ele.stroke,
            roughness: 0,
            strokeWidth: 5,
          });
        }
      });
      const canvasImage = canvasRef.current.toDataURL();
      socket.emit("whiteboardData", canvasImage);
    }
  }, [elements]);


  const handleMouseMove = (e) => {
    if (!isDrawing) {
      return;
    }
    const { offsetX, offsetY } = e.nativeEvent;

    if (tool === "rect") {
      setElements((prevElements) =>
        prevElements.map((ele, index) =>
          index === elements.length - 1
            ? {
                offsetX: ele.offsetX,
                offsetY: ele.offsetY,
                width: offsetX - ele.offsetX,
                height: offsetY - ele.offsetY,
                stroke: ele.stroke,
                element: ele.element,
              }
            : ele
        )
      );
    } else if (tool === "line") {
      setElements((prevElements) =>
        prevElements.map((ele, index) =>
          index === elements.length - 1
            ? {
                offsetX: ele.offsetX,
                offsetY: ele.offsetY,
                width: offsetX,
                height: offsetY,
                stroke: ele.stroke,
                element: ele.element,
              }
            : ele
        )
      );
    } else if (tool === "pencil") {
      setElements((prevElements) =>
        prevElements.map((ele, index) =>
          index === elements.length - 1
            ? {
                offsetX: ele.offsetX,
                offsetY: ele.offsetY,
                path: [...ele.path, [offsetX, offsetY]],
                stroke: ele.stroke,
                element: ele.element,
              }
            : ele
        )
      );
    }
  };
  const handleMouseUp = () => {
    setIsDrawing(false);
  };
  if(!user?.presenter){
    return(
      <div
      className="overflow-hidden border border-dark border-3 h-100 w-100">
      <img src={img} alt="real time white board shared by presenter" style={{height:window.innerHeight*1, width:"165%"}}/>
    </div>
    )
  }
  return (
    <div
      className="col-md-8 overflow-hidden border border-dark px-0 mx-auto mt-3"
      style={{ height: "500px" }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Whiteboard;