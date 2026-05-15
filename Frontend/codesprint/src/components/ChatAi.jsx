import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import {
  Send,
  Trash2,
  Sparkles,
  Copy,
  Check
} from "lucide-react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function ChatAi({ problem }) {

  const [messages, setMessages] = useState([
    {
      role: "model",
      content:
        "👋 Hi! I’m CodeSprint AI. Ask me anything about this problem."
    }
  ]);

  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages]);

  const deleteMessage = (index) => {
    setMessages((prev) => prev.filter((_, i) => i !== index));
  };

  const copyCode = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);

    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (data) => {

    const userMessage = {
      role: "user",
      content: data.message
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);

    reset();

    try {

      const response = await axiosClient.post("/chat/ai", {
        messages: updatedMessages,
        title: problem.title,
        description: problem.description,
        testCases: problem.visibleTestCases,
        startCode: problem.startCode
      });

      const fullText = response.data.message;

      let currentText = "";

      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          content: ""
        }
      ]);

      for (let i = 0; i < fullText.length; i++) {

        currentText += fullText[i];

        await new Promise((r) => setTimeout(r, 20));

        setMessages((prev) => {

          const updated = [...prev];

          updated[updated.length - 1] = {
            role: "model",
            content: currentText
          };

          return updated;
        });
      }

    } catch (error) {

      console.log(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          content:
            error.response?.data?.message ||
            "⚠️ Something went wrong"
        }
      ]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-white rounded-2xl overflow-hidden border border-gray-800">

      {/* HEADER */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800 bg-[#161b22]">
        <Sparkles className="text-purple-400" size={18} />
        <h2 className="font-semibold text-purple-300">
          CodeSprint AI Chat
        </h2>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {messages.map((msg, index) => (

          <div
            key={index}
            className={`flex ${
              msg.role === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >

            <div className="relative group max-w-[80%]">

              {/* MESSAGE BOX */}
              <div
                className={`px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap shadow ${
                  msg.role === "user"
                    ? "bg-purple-600 text-white"
                    : "bg-[#161b22] text-gray-200 border border-gray-800"
                }`}
              >

                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code(props) {

                      const { children, className } = props;

                      const codeString = String(children).replace(/\n$/, "");

                      const isInline = !className;

                      // CODE BLOCK
                      if (!isInline) {

                        return (
                          <div className="relative my-3">

                            {/* CODE BOX */}
                            <pre className="bg-[#1f2937] text-white p-4 rounded-lg border border-gray-700 overflow-x-auto text-sm leading-relaxed">
                              <code>{codeString}</code>
                            </pre>

                            {/* COPY BUTTON */}
                            <button
                              onClick={() => copyCode(codeString)}
                              className="absolute right-2 top-2 bg-gray-800 px-2 py-1 rounded text-xs hover:bg-gray-700 flex items-center gap-1 transition"
                            >

                              {copied ? (
                                <>
                                  <Check size={14} />
                                  Copied
                                </>
                              ) : (
                                <>
                                  <Copy size={14} />
                                  Copy
                                </>
                              )}

                            </button>

                          </div>
                        );
                      }

                      // INLINE CODE
                      return (
                        <code className="bg-black px-1 py-0.5 rounded text-purple-300 font-semibold">
                          {children}
                        </code>
                      );
                    }
                  }}
                >
                  {msg.content}
                </ReactMarkdown>

              </div>

              {/* DELETE BUTTON */}
              <button
                onClick={() => deleteMessage(index)}
                className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 bg-red-500 p-1 rounded-full transition"
              >
                <Trash2 size={12} />
              </button>

            </div>

          </div>

        ))}

        <div ref={messagesEndRef} />

      </div>

      {/* INPUT */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-3 border-t border-gray-800 bg-[#161b22] flex items-center gap-2"
      >

        <input
          placeholder="Ask something..."
          className="flex-1 px-4 py-2 rounded-xl bg-[#0d1117] border border-gray-700 focus:border-purple-500 outline-none text-sm"
          {...register("message", {
            required: true,
            minLength: 2
          })}
        />

        <button
          type="submit"
          disabled={errors.message}
          className="bg-purple-600 hover:bg-purple-700 p-2 rounded-xl transition"
        >
          <Send size={18} />
        </button>

      </form>

    </div>
  );
}

export default ChatAi;