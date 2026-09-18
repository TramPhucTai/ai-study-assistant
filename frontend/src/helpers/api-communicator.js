import axios from "axios";



export const loginUser = async (email, password) => {
  const res = await axios.post("/user/login", {
    email,
    password,
  });

  return res.data;
};

export const signupUser = async (name, email, password) => {
  const res = await axios.post("/user/signup", {
    name,
    email,
    password,
  });

  return res.data;
};

export const checkAuthStatus = async () => {
  const res = await axios.get("/user/auth-status");

  return res.data;
};

export const sendChatRequest = async (message) => {
  const res = await axios.post("/chat/new", { message });

  return res.data;
};

export const logoutUser = async () => {
  const res = await axios.get("/user/logout");

  return res.data;
};



const API_BASE_URL = "http://localhost:5000/api/v1";

export async function streamChatRequest(conversationId, message, onTextDelta) {
  const response = await fetch(`${API_BASE_URL}/chat/new`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ conversationId, message })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message || "Unable to send message"
    );
  }

  if (!response.body) {
    throw new Error("Streaming is not supported by this browser");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();

    buffer += decoder.decode(value || new Uint8Array(), {
      stream: !done
    });

    const lines = buffer.split("\n");

    // The last entry may contain an incomplete JSON object.
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (!line.trim()) {
        continue;
      }

      const event = JSON.parse(line);

      if (event.type === "text_delta") {
        onTextDelta(event.text);
      }

      if (event.type === "error") {
        throw new Error(event.message);
      }
    }

    if (done) {
      break;
    }
  }

  // Process a final line if the server didn't end it with "\n".
  if (buffer.trim()) {
    const event = JSON.parse(buffer);

    if (event.type === "text_delta") {
      onTextDelta(event.text);
    }

    if (event.type === "error") {
      throw new Error(event.message);
    }
  }
};



export const createConversation = async () => {
  const res = await axios.post(
    "/chat/conversations"
  );

  return res.data;
};


export const getUserConversations = async () => {
  const res = await axios.get(
    "/chat/conversations"
  );

  return res.data;
};


export const getConversation = async (
  conversationId
) => {

  const res = await axios.get(
    `/chat/conversations/${conversationId}`
  );

  return res.data;
};


export const deleteConversation = async (
  conversationId
) => {

  const res = await axios.delete(
    `/chat/conversations/${conversationId}`
  );

  return res.data;
};

// Send the selected file to the backend API
export const uploadDocument = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

  const res = await axios.post(
    "/documents/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};