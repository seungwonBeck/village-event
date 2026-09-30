"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
export function Reveal({children,className=""}:{children:ReactNode;className?:string}) {
 const element=useRef<HTMLDivElement>(null);
 const [visible,setVisible]=useState(false);
 useEffect(()=>{
  // 콘텐츠는 기본적으로 표시하고, 화면에 들어올 때 한 번만 등장 효과를 더합니다.
  const observer=new IntersectionObserver(entries=>{
   if(entries.some(entry=>entry.isIntersecting)){setVisible(true);observer.disconnect();}
  },{threshold:.08});
  if(element.current)observer.observe(element.current);
  return()=>observer.disconnect();
 },[]);
 return <div ref={element} className={`${visible?"reveal-visible":""} ${className}`}>{children}</div>;
}
