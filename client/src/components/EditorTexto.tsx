import React, { useCallback, useEffect, useState} from 'react'
import "quill/dist/quill.snow.css"
import Quill, { Sources } from "quill";
import { io, Socket } from 'socket.io-client';
import Delta from 'quill-delta';
import { Params, useParams } from 'react-router';

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false]}],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" ,}],
  ["bold", "italic", "underline"],
  [{ color: [] }, {background: [] }],
  [{ script: "sub" }, {script: "super"}],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
]

export default function EditorTexto() {
  const [socket, setSocket] = useState<Socket>();
  const [quill, setQuill] = useState<Quill>();
  const { id: documentId } = useParams<Params>();
  
  
    // useffect 1 - conexão socket.io(server)
    useEffect(() => {
      const s = io("http://127.0.0.1:3001");
      setSocket(s);

      s.on('connect', () => {
          console.log('usuário conectou');
      });
  
      s.on('disconnect', () => {
          console.log('usuário desconectou');
      });
  
      return () => {
          s.disconnect();
      }
  }, [])


    // useffect 3 - mudanças no doc(receive)
    useEffect(() => {
      const changeHandler = (delta: Delta, oldDelta: Delta, source: Sources) => {
        quill?.updateContents(delta)
      }
      socket?.on("receive-changes", changeHandler);
  
      return () => {
          socket?.off("receive-change", changeHandler)
      }
  }, [socket, quill])


  // useffect 2 - mudanças no doc(send)
  useEffect(() => {
    const changeHandler = (delta: Delta, oldDelta: Delta, source: Sources) => {
        if (source !== "user") return;
        socket?.emit('send-changes', delta);
    }
    quill?.on("text-change", changeHandler);

    return () => {
        quill?.off("text-change", changeHandler)
    }
}, [socket, quill])


  const wrapperRef = useCallback(
    (wrapper: HTMLElement | null) => {
        if (wrapper == null) return;
        
        wrapper.innerHTML = "";
        const textEditor = document.createElement("div");
        wrapper.append(textEditor);
        const q = new Quill(textEditor, { theme: "snow", modules: { toolbar: TOOLBAR_OPTIONS}});
        setQuill(q);
    },
    [],
)


  return (
    <div className="container" ref={wrapperRef}>

    </div>
  )
}
