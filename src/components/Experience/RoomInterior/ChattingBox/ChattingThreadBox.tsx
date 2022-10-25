import useWindowDimensions from "components/Common/useWindowDimensions";
import { ChattingBoxData } from "data/Experience";
import { useEffect, useState } from "react";
import { RootStateOrAny, useSelector } from "react-redux";
import { setMsg } from "redux/slices/chatSlice";
import ChattingThread from "./ChattingThread";
import TypingNotification from "./TypingNotification";

const appendMyNewChattingThread = (msgs, setMsgs, props) => {
  setMsgs([
    ...msgs,
    <ChattingThread
      imgUrl="/images/experience/room_user_avatars/room_user_avatar_15.webp"
      uName="You"
      text={props.newMsgDataState.myMsg}
      before="1m"
      hisMsg={props.newMsgDataState.reply.hisMsg}
      replyToWhom={props.newMsgDataState.reply.replyToWhom}
      fileUrls={props.newMsgDataState.files.fileUrls}
      fileNames={props.newMsgDataState.files.fileNames}
    />,
  ]);
  props.setNewMsgSendingState(false);
  props.setNewMsgDataState({
    reply: {
      replying: false,
      replyToWhom: "",
      hisMsg: "",
    },
    myMsg: "",
    files: {
      fileExists: false,
      fileNames: [],
      fileUrls: [],
    },
  });
};

const initChatbox = (props) => {
  const tempMsgs = [];
  ChattingBoxData.map((i, j) => {
    tempMsgs.push(
      <ChattingThread
        imgUrl={i.imgUrl}
        uName={i.uName}
        text={i.text}
        before={i.before}
        hisMsg={i.hisMsg}
        replyToWhom={i.replyToWhom}
        fileUrls={i.fileUrls}
        fileNames={["__FOR__INITIAL__DATA__"]}
        key={j}
      />
    );
  });
  return tempMsgs;
};

const ChattingThreadBox = () => {
  const { msgs, chatLogs } = useSelector((state: RootStateOrAny) => ({
    msgs: state.chat.msgs,
    chatLogs: state.chat.chatLogs,
  }));
  return (
    <div
      className={`flex h-[700px] gap-[24px] relative mb-[24px] rounded-2xl `}
      id="chatting_thread_box"
    >
      <div
        className="flex flex-col px-[26px] w-full h-full overflow-y-scroll overflow-x-visible gap-[2px] relative pb-[30px]"
        id="chatting_thread_box_1"
      >
        {chatLogs.map((chatLog, index) => (
          <ChattingThread
            imgUrl={!!chatLog.sender.profileImage ? chatLog.sender.profileImage : "/images/experience/psuedo_avatars/avatar.png"}
            uName={chatLog.sender.name}
            text={chatLog.content}
            date={chatLog.date}
            hisMsg={!!chatLog.reply.hisMsg ? chatLog.reply.hisMsg : ""}
            replyToWhom={chatLog.reply.replyToWhom}
            attachments={chatLog.attachments}
            fileNames={["__FOR__INITIAL__DATA__"]}
            key={index}
          />
        ))}
      </div>
      {/* <TypingNotification who={["Eugene", "Alex1440", "Eugene", "Alex1440"]} /> */}
    </div>
  );
};

export default ChattingThreadBox;
