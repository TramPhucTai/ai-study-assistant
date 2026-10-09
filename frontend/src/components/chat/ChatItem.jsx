import { memo } from "react";
import { Box, Avatar } from "@mui/material"
import { useAuth } from "../../context/useAuth.js"
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

            flexDirection: {
              xs: "column",
              sm: "row",
            },

            alignItems: "flex-start",

            p: {
              xs: 1.5,
              sm: 2,
            },

            bgcolor: "#00748112",
            my: 2,

            gap: {
              xs: 1,
              sm: 2,
            },

            minWidth: 0,
            maxWidth: "100%",
          }}
        >
          <Avatar
            src="/robot-profile.png"
            alt="Robot"
            sx={{
              ml: 0,
              flexShrink: 0,

              width: {
                xs: 40,
                sm: 48,
              },

              height: {
                xs: 40,
                sm: 48,
              },

              bgcolor: "transparent",

              "& img": {
                objectFit: "contain",
                width: "100%",
                height: "100%",
              },
            }}
          />

          <Box
            sx={{
              minWidth: 0,
              width: "100%",
              maxWidth: "100%",
              overflowWrap: "break-word",
              wordBreak: "break-word",

              "& .katex-display": {
                overflowX: "auto",
                overflowY: "hidden",
                py: 1,
              },

              "& .katex-display > .katex": {
                whiteSpace: "nowrap",
              },
            }}
          >
            <ReactMarkdown
              remarkPlugins={[
                remarkGfm,
                remarkMath
              ]}
              rehypePlugins={[
                [
                  rehypeKatex,
                  {
                    strict: "ignore",
                    throwOnError: false,
                  }
                ]
              ]}
              components={{
                code({ inline, className, children, ...props }) {
                  const match =
                    /language-(\w+)/.exec(
                      className || ""
                    );

                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={coldarkDark}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(
                        /\n$/,
                        ""
                      )}
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

                h1({ children }) {
                  return (
                    <Box
                      component="h1"
                      sx={{
                        fontSize: {
                          xs: "22px",
                          sm: "28px",
                        },
                        mt: 2,
                        mb: 1.5,
                      }}
                    >
                      {children}
                    </Box>
                  );
                },

                h2({ children }) {
                  return (
                    <Box
                      component="h2"
                      sx={{
                        fontSize: {
                          xs: "20px",
                          sm: "24px",
                        },
                        mt: 2,
                        mb: 1.5,
                      }}
                    >
                      {children}
                    </Box>
                  );
                },

                h3({ children }) {
                  return (
                    <Box
                      component="h3"
                      sx={{
                        fontSize: {
                          xs: "18px",
                          sm: "21px",
                        },
                        mt: 2,
                        mb: 1,
                      }}
                    >
                      {children}
                    </Box>
                  );
                },

                p({ children }) {
                  return (
                    <Box
                      component="p"
                      sx={{
                        fontSize: "18px",
                        lineHeight: 1.6,
                        mt: 0,
                        mb: 1,
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
                        fontSize: {
                          xs: "15px",
                          sm: "18px",
                        },
                        lineHeight: 1.6,
                        my: 1,
                        pl: {
                          xs: 2.5,
                          sm: 4,
                        },
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
                        fontSize: {
                          xs: "15px",
                          sm: "18px",
                        },
                        lineHeight: 1.6,
                        my: 1,
                        pl: {
                          xs: 2.5,
                          sm: 4,
                        },
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
                        fontSize: {
                          xs: "15px",
                          sm: "18px",
                        },
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
                        fontSize: {
                          xs: "14px",
                          sm: "18px",
                        },
                        padding: {
                          xs: "6px",
                          sm: "10px",
                        },
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
                        padding: {
                          xs: "6px",
                          sm: "10px",
                        },
                        fontSize: {
                          xs: "14px",
                          sm: "18px",
                        },
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
                        padding: {
                          xs: "6px",
                          sm: "10px",
                        },
                        fontSize: {
                          xs: "14px",
                          sm: "18px",
                        },
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
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            alignItems: "flex-start",
            p: {
              xs: 1.5,
              sm: 2,
            },
            bgcolor: "#075E68",
            gap: {
              xs: 1,
              sm: 2,
            },
            borderRadius: 2,
            minWidth: 0,
            maxWidth: "100%",
          }}
        >
          <Avatar
            sx={{
              ml: 0,
              bgcolor: "black",
              color: "white",
              flexShrink: 0,

              width: {
                xs: 40,
                sm: 48,
              },

              height: {
                xs: 40,
                sm: 48,
              },

              fontSize: {
                xs: "16px",
                sm: "20px",
              },
            }}
          >
            {getInitials(auth?.user?.name)}
          </Avatar>

          <Box
            sx={{
              fontSize: {
                xs: "15px",
                sm: "18px",
              },
              width: "100%",
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
                        fontSize: {
                          xs: "15px",
                          sm: "18px",
                        },
                        lineHeight: {
                          xs: 1.55,
                          sm: 1.6,
                        },
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

export default memo(ChatItem);