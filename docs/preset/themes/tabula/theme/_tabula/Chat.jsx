import React from 'react';

export const Chat = ({ children, caption }) => {
  return (
    <figure className="mdx-chat">
      <div className="chat-container">{children}</div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
};

export const ChatUserText = ({ children, note }) => (
  <div className="chat-input chat-item stack-xs">
    <p className="chat-bubble">
      <span className="sr-only">User: </span>
      <span className="content">{children}</span>
    </p>
    {note && <p className="chat-note">{note}</p>}
  </div>
);

export const ChatBotText = ({ children, note }) => (
  <div className="chat-output chat-item stack-xs">
    <p className="chat-bubble">
      <span className="sr-only">Bot: </span>
      <span className="content">{children}</span>
    </p>
    {note && <p className="chat-note">{note}</p>}
  </div>
);
