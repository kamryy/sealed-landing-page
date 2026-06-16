"use client";

import { useState } from "react";
import ConnectingWalletModal from "@/components/top-up/ConnectingWalletModal";
import Image from "next/image";

import type { CodeItem } from "./ConnectingWalletContainer";

interface CollectingWalletStepFiveProps {
  onStatusChange?: (step: number) => void;
  codes: CodeItem[];
  loading: boolean;
  error?: string | null;
}

// Insert a dash every 4 characters for readability (display only).
function formatCode(code: string): string {
  return code.replace(/(.{4})(?=.)/g, "$1-");
}

export default function CollectingWalletStepFive({
  onStatusChange,
  codes,
  loading,
  error,
}: CollectingWalletStepFiveProps) {
  const [connectWalletModalOpen, setConnectWalletModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<number[]>([]);

  const copyToClipboard = (code: string, codeId: number) => {
    navigator.clipboard.writeText(code);
    setCopiedId([...copiedId, codeId]);
  };

  const downloadCodes = () => {
    const codeText = codes.map((c) => c.code).join("\n");
    setCopiedId(codes.map((c) => c.id));
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(codeText),
    );
    element.setAttribute("download", "codes.txt");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const openModal = () => {
    setConnectWalletModalOpen(true);
  };

    const onCloseModalHandler = () => {
    // setConnectWalletModalOpen(false);
  };

  const onFinishHandler = () => {
    onStatusChange?.(3);
  }


  return (
    <>
      <style>{`
        #codesScrollContainer::-webkit-scrollbar {
          width: 12px;
        }
        
        #codesScrollContainer::-webkit-scrollbar-track {
          background: transparent;
        }
        
        #codesScrollContainer::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 6px;
          border: 3px solid rgba(0, 0, 0, 0.25);
        }
        
        #codesScrollContainer::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.25);
        }
      `}</style>
      <div className="gap-6 flex-1 min-h-0 w-full flex flex-col items-center justify-between">
        <div className="flex flex-col gap-2 w-full h-full min-h-0">
          <p className="text-2xl sm:text-4xl font-bold ">Keep Your codes</p>
          <p className="text-base sm:text-xl text-[#b3b3b3]">
            Copy the codes below to a location of Your choice, or <br />
            download the .txt file containing all the generated codes.
          </p>

          {codes.length > 0 && (
            <button
              onClick={downloadCodes}
              className="mt-4 flex gap-3 items-center justify-end px-4 py-2 rounded-lg text-sealed-teal font-semibold cursor-pointer"
            >
              Download Codes{" "}
              <Image
                src="/assets/icons/download.svg"
                alt="download-icon"
                width="16"
                height="16"
              />
            </button>
          )}

          <div
            id="codesScrollContainer"
            className="bg-[rgba(0,0,0,0.25)] overflow-y-auto overflow-x-auto p-4 w-full flex-1 min-h-0 scroll-y rounded-xl border border-[#262626] text-[#b3b3b3b] mt-4"
          >
            {codes.length > 0 ? (
              <table className="w-full text-sm bg-[rgba(0,0,0,0.25)]">
                <thead className="sticky top-0 left-0 right-0 z-10 bg-[rgba(0,0,0,0.25)] border-b border-[rgba(255,255,255,0.6)]">
                  <tr>
                    <th className="text-left py-2 px-3 font-semibold">
                      Number
                    </th>
                    <th className="text-left py-2 px-3 font-semibold">Code</th>
                    <th className="text-left py-2 px-3 font-semibold">
                      Status
                    </th>
                    <th className="text-center py-2 px-3 font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {codes.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-[#262626] hover:bg-[#252525] transition"
                    >
                      <td className="py-3 px-3 text-[#b3b3b3]">{item.id}</td>
                      <td className="py-3 px-3 font-mono text-[#e0e0e0]">
                        {formatCode(item.code)}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-3 py-1 rounded-md text-xs font-semibold ${
                            copiedId?.includes(item.id)
                              ? "border border-sealed-teal text-sealed-teal"
                              : "bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.2)] text-[#dfebfd]"
                          }`}
                        >
                          {copiedId?.includes(item.id) ? "Copied" : "Waiting"}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => copyToClipboard(item.code, item.id)}
                          className="inline-flex cursor-pointer items-center justify-center p-2 hover:bg-[#262626] rounded-lg transition"
                          title="Copy to clipboard"
                        >
                          <Image
                            src="/assets/icons/copy.svg"
                            alt="copy"
                            width="18"
                            height="18"
                          />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : loading ? (
              <div className="flex flex-col gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 animate-pulse"
                  >
                    <div className="h-4 w-8 rounded bg-[rgba(255,255,255,0.08)]" />
                    <div className="h-4 flex-1 rounded bg-[rgba(255,255,255,0.08)]" />
                    <div className="h-4 w-16 rounded bg-[rgba(255,255,255,0.08)]" />
                    <div className="h-4 w-8 rounded bg-[rgba(255,255,255,0.08)]" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-center px-4">
                <p className={error ? "text-red-500" : "text-[#b3b3b3]"}>
                  {error ?? "No codes available"}
                </p>
              </div>
            )}
          </div>

          <div className="flex mt-4 justify-between w-full">
            <button
              className="px-6 sm:px-10 py-3 rounded-xl cursor-pointer border border-[rgba(255,255,255,0.2)] "
              onClick={() => onStatusChange?.(3)}
            >
              Back
            </button>

            <button
              className="px-6 sm:px-10 py-2 rounded-xl cursor-pointer bg-sealed-teal text-black"
              onClick={openModal}
            >
              Finish
            </button>
          </div>
        </div>
      </div>
        {connectWalletModalOpen && (
              <ConnectingWalletModal
                isOpen={connectWalletModalOpen}
                onClose={onCloseModalHandler}
                headerText={"Transaction"}
                contentText={"Make sure you copied all the codes and downloaded the .txt file. This operation cannot be undone, and we will not be able to provide you with the codes again."}
                contentHeaderText={"The codes cannot be recovered"}
                isLoadingModal={false}
                isFinishModal={true}
                onFinish={onFinishHandler}
                goBack={onCloseModalHandler}
              />
            )}
    </>
  );
}
