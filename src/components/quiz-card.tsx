"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Character } from "@/components/event-art";
export function QuizCard({ preview }: { preview:boolean }){
 const [answer,setAnswer]=useState("");const [pending,setPending]=useState(false);const [submitted,setSubmitted]=useState(false);const [error,setError]=useState("");
 async function submit(){
  if(!answer||pending||submitted)return;setPending(true);
  try{if(supabase&&!preview){const{error}=await supabase.from("votes").insert({participant_id:localStorage.getItem("reongoeul-participant-id"),question_id:"matthew-5-16",answer});if(error)throw error;}setSubmitted(true);}
  catch{setError("답을 보내지 못했어요. 다시 시도해주세요.");}finally{setPending(false);}
 }
 return <section className="soft-card mt-6 p-6"><p className="text-sm font-bold text-[#3984a1]">함께 푸는 말씀 퀴즈</p><h2 className="mt-3 text-xl font-bold">마태복음 5장 16절에서 우리의 빛을 통해 누구께 영광을 돌리라고 하나요?</h2><div role="radiogroup" aria-label="퀴즈 정답 선택" className="mt-5 space-y-2">{["우리 자신","하늘에 계신 아버지","이웃","친구"].map(choice=><button role="radio" aria-checked={answer===choice} key={choice} disabled={submitted} onClick={()=>setAnswer(choice)} className={`w-full rounded-xl border p-3 text-left ${answer===choice?"border-[#e8428b] bg-[#ffe5f0]":"border-[#d6e4eb] bg-white"}`}>{answer===choice?"✓ ":"○ "}{choice}</button>)}</div><button className="pink-button mt-5 w-full" disabled={!answer||pending||submitted} onClick={submit}>{submitted?"제출 완료":pending?"제출 중…":"정답 제출"}</button>{submitted&&<p role="status" className="mt-4 text-center font-bold">{answer==="하늘에 계신 아버지"?"정답이에요! 함께 말씀을 기억해요.":"함께 다시 읽어봐요. 정답은 하늘에 계신 아버지예요."}</p>}{error&&<p role="alert" className="mt-4 text-sm text-[#b6194c]">{error}</p>}<Character name="kazama" className="mx-auto w-24"/></section>;
}

