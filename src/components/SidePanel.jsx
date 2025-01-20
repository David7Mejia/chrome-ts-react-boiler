import React, { useEffect, useState } from "react";
import "../styles/SidePanel.css";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import { getEnhancedPromptThunk, streamEnhancedPromptThunk } from "../../store/features/prompt";
import cn from "classnames";

const SidePanel = () => {
  const dispatch = useDispatch();
  const promptStream = useSelector(state => state.prompt?.streamedContent);
  const loading = useSelector(state => state.prompt.loading);
  const [clientMessages, setClientMessages] = useState([]);
  // const state = useSelector(state => state);
  // console.log("Redux State Test:", state);

  const [prompt, setPrompt] = useState("");
  const [selectedFramework, setSelectedFramework] = useState("");
  const [selectedTab, setSelectedTab] = useState(0);

  const frameworks = ["AIDA", "BAB", "PAS", "GRADE", "CREO", "FAB", "4C's", "PASTOR", "SCAMPER", "KISS", "Hero's Journey"];

  const handleEnhance = () => {
    if (!prompt || !selectedFramework) {
      alert("Please enter a prompt and select a framework.");
      return;
    }
    //store the prompt in the clientMessages array
    setClientMessages([...clientMessages, prompt]);
    //clear the textarea
    setPrompt("");

    // Dispatching the thunk with the current prompt and selected framework
    // dispatch(getEnhancedPromptThunk({ prompt: prompt, framework: selectedFramework }));
    dispatch(streamEnhancedPromptThunk({ prompt: prompt, framework: selectedFramework }));
  };
  useEffect(() => {
    console.log("this is the prompt", prompt);
    // console.log("this is the state ********: ", state);
  }, [selectedTab, prompt]);

  return (
    <div className="sidepanel-container">
      <div className="sidepanel-top">
        {/* <p className="greeting-ptag">OCULUS</p> */}
        <span className="greeting-span">How can I assist you today?</span>
        <div className="sidepanel-tabs">
          <div
            className={cn("sidepanel-tab spt-left", {
              selected_tab: selectedTab === 0,
            })}
            onClick={() => setSelectedTab(0)}
          >
            ENHANCE
          </div>
          <div className="tab-divider"></div>
          <div
            className={cn("sidepanel-tab spt-right", {
              selected_tab: selectedTab === 1,
            })}
            onClick={() => setSelectedTab(1)}
          >
            CHAT
          </div>
        </div>
      </div>
      <div className="sp-message-container">{promptStream}</div>
      <div className="chatbox-area">
        <Formik initialValues={{ prompt: "" }} onSubmit={() => handleEnhance()}>
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit} className="sidepanel-form">
              {selectedTab === 0 && (
                <select value={selectedFramework} onChange={e => setSelectedFramework(e.target.value)} className="framework-select">
                  <option value="" disabled>
                    Select Framework
                  </option>
                  {frameworks.map((framework, index) => (
                    <option key={index} value={framework}>
                      {framework}
                    </option>
                  ))}
                </select>
              )}
              <textarea
                name="prompt"
                placeholder={selectedTab === 0 ? "Enter your prompt here..." : "Type your message..."}
                value={prompt}
                onChange={e => {
                  console.log("this is the value:", e.target.value);
                  setPrompt(e.target.value);
                }}
                rows="5"
                className="sidepanel-input"
              />

              <button type="submit" disabled={loading} className="enhance-prompt-btn">
                {/* {loading ? "Enhancing..." : "Enhance Prompt"} */}
                {selectedTab === 0 ? "Enhance Prompt" : "Send Message"}
              </button>
            </form>
          )}
        </Formik>

        {/* {promptStream && (
          <div className="enhanced-result">
            <h4>Enhanced Prompt:</h4>
            <p>{promptStream}</p>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default SidePanel;
