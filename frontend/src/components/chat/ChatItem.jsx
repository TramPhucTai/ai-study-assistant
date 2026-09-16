import { Box, Avatar } from "@mui/material"
import { useAuth } from "../../context/AuthContext"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coldarkDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import getInitials from "../../utils/get-initials";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";



function ChatItem({ content, role }) {
  const auth = useAuth();

  return (
    <>
      {role === 'assistant' ? (

        // Assistant
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            p: 2,
            bgcolor: "#00748112",
            my: 2,
            gap: 2,
            minWidth: 0,
            maxWidth: "100%",
          }}
        >
          <Avatar
            sx={{
              ml: "0",
              flexShrink: 0,
              mt: "16px"
            }}
          >
            <img
              src="robot-profile.png"
              width={"30px"}
            />
          </Avatar>

          <Box
            sx={{
              minWidth: 0,
              maxWidth: "100%",
              overflowX: "auto",
              overflowWrap: "break-word",
              wordBreak: "break-word",
            }}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={{
                code({ inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");

                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={coldarkDark}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code
                      className={className}
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },

                p({ children }) {
                  return (
                    <Box
                      component="p"
                      sx={{
                        fontSize: "18px",
                        lineHeight: 1.6,
                        my: 1,
                      }}
                    >
                      {children}
                    </Box>
                  );
                },

                ul({ children }) {
                  return (
                    <Box
                      component="ul"
                      sx={{
                        fontSize: "18px",
                        lineHeight: 1.6,
                        my: 1,
                      }}
                    >
                      {children}
                    </Box>
                  );
                },

                ol({ children }) {
                  return (
                    <Box
                      component="ol"
                      sx={{
                        fontSize: "18px",
                        lineHeight: 1.6,
                        my: 1,
                      }}
                    >
                      {children}
                    </Box>
                  );
                },

                li({ children }) {
                  return (
                    <Box
                      component="li"
                      sx={{
                        fontSize: "18px",
                        lineHeight: 1.6,
                      }}
                    >
                      {children}
                    </Box>
                  );
                },

                table({ children }) {
                  return (
                    <Box
                      component="table"
                      sx={{
                        width: "100%",
                        borderCollapse: "collapse",
                        my: 2,
                        fontSize: "18px",
                      }}
                    >
                      {children}
                    </Box>
                  );
                },

                th({ children }) {
                  return (
                    <Box
                      component="th"
                      sx={{
                        border: "1px solid #666",
                        padding: "10px",
                        textAlign: "left",
                        fontWeight: "bold",
                      }}
                    >
                      {children}
                    </Box>
                  );
                },

                td({ children }) {
                  return (
                    <Box
                      component="td"
                      sx={{
                        border: "1px solid #666",
                        padding: "10px",
                        verticalAlign: "top",
                      }}
                    >
                      {children}
                    </Box>
                  );
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </Box>
        </Box>

      ) : (

        // User
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            p: 2,
            bgcolor: "#004d56",
            gap: 2,
            borderRadius: 2,
            minWidth: 0,
            maxWidth: "100%",
          }}
        >
          <Avatar
            sx={{
              ml: "0",
              bgcolor: "black",
              color: "white",
              flexShrink: 0,
            }}
          >
            {/* Display the first letter of both First and Last name */}
            {getInitials(auth?.user?.name)}
          </Avatar>

          <Box
            sx={{
              fontSize: "18px",
              minWidth: 0,
              maxWidth: "100%",
              overflowWrap: "break-word",
              wordBreak: "break-word",
            }}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p({ children }) {
                  return (
                    <Box
                      component="p"
                      sx={{
                        fontSize: "18px",
                        lineHeight: 1.6,
                        m: 0,
                      }}
                    >
                      {children}
                    </Box>
                  );
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </Box>
        </Box>

      )}
    </>
  )
}

export default ChatItem;