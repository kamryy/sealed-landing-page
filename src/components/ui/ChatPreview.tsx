import Image from 'next/image';

function ChatActions() {
  return (
    <div className="flex w-25.5 items-center justify-between">
      <Image
        src="/assets/icons/add_file.svg"
        alt="Attach file"
        width={11}
        height={11}
        className="h-2.75 w-2.75"
      />
      <Image
        src="/assets/icons/gallery.svg"
        alt="Open gallery"
        width={11}
        height={11}
        className="h-2.75 w-2.75"
      />
      <Image
        src="/assets/icons/microphone.svg"
        alt="Record voice"
        width={11}
        height={11}
        className="h-2.75 w-2.75"
      />
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#005640] text-[11px] text-white">
        <Image
          src="/assets/icons/send.svg"
          alt="Send message"
          width={12}
          height={12}
          className="h-3 w-3"
        />
      </span>
    </div>
  );
}

/** Left chat card — shows an encrypted outgoing message. */
export function SenderChatPreview() {
  return (
    <div className="absolute left-[-2%] top-[54%] z-20 w-62 origin-top-left scale-[0.65] rounded-[23px] bg-[#0f0f0f]/95 px-4.5 py-3.75 shadow-[0_20px_45px_rgba(0,0,0,0.4)] backdrop-blur-sm sm:scale-[0.7] md:scale-[0.85] lg:scale-100">
      <div className="space-y-1.75 bg-[#0f0e13] pb-1.75">
        <div className="space-y-1.75">
          {/* Incoming message */}
          <div className="space-y-1.25">
            <div className="flex items-center gap-1.25 text-[7px] leading-normal">
              <span className="font-semibold text-white">User #145</span>
              <span className="text-[#bebebe]">21 min ago</span>
            </div>
            <p className="w-45.5 rounded-bl-[11px] rounded-br-[11px] rounded-tr-[11px] bg-[#005640] px-1.75 py-1.5 text-[7px] leading-normal text-white">
              Hi, I&apos;ll send you the file I mentioned in a moment — what
              format do you need it in?
            </p>
          </div>

          {/* Encrypted outgoing message */}
          <div className="flex items-end justify-end">
            <div className="space-y-1.25">
              <div className="flex items-center justify-end gap-1.25 text-[7px] leading-normal">
                <span className="text-[#bebebe]">1 min ago</span>
                <span className="font-semibold text-white">You</span>
              </div>
              <div className="w-42 rounded-bl-[11px] rounded-br-[11px] rounded-tl-[11px] bg-[#2a2a2a] px-1.75 py-1.5 text-[7px] leading-normal text-[#bebebe]">
                <p className="text-[#ca7344]">---Begin Message---</p>
                <p className="text-sealed-teal">
                  2c6ce057-1f92-41eaaff4e787c7092186R_zQGA
                </p>
                <p className="text-[#ca7344]">---End Message---</p>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-[#303239]" />
      </div>

      <div className="mt-1.75 flex items-center justify-between gap-2">
        <div className="w-25.5 rounded bg-[#303239] px-1.5 py-1 text-[7px] leading-normal text-white/80">
          <p>Or any other format</p>
          <p>Thanks again.</p>
        </div>
        <ChatActions />
      </div>
    </div>
  );
}

/** Right chat card — shows a plain-text conversation with typing indicator. */
export function ReceiverChatPreview() {
  return (
    <div className="absolute right-[-3%] top-[16%] z-30 w-62 origin-top-right scale-[0.65] rounded-[23px] bg-[#0f0f0f]/95 px-4.5 py-3.75 shadow-[0_20px_45px_rgba(0,0,0,0.4)] backdrop-blur-sm sm:scale-[0.7] md:scale-[0.85] lg:scale-100">
      <div className="space-y-1.75 bg-[#0f0e13] pb-1.75">
        <div className="space-y-1.75">
          {/* Own outgoing message */}
          <div className="flex items-end justify-end">
            <div className="space-y-1.25">
              <div className="flex items-center justify-end gap-1.25 text-[7px] leading-normal">
                <span className="font-semibold text-white">You</span>
                <span className="text-[#bebebe]">21 min ago</span>
              </div>
              <p className="w-45.5 rounded-bl-[11px] rounded-br-[11px] rounded-tl-[11px] bg-[#2a2a2a] px-1.75 py-1.5 text-[7px] leading-normal text-[#bebebe]">
                Hi, I&apos;ll send you the file I mentioned in a moment — what
                format do you need it in?
              </p>
            </div>
          </div>

          {/* Incoming reply */}
          <div className="space-y-1.25">
            <div className="flex items-center gap-1.25 text-[7px] leading-normal">
              <span className="text-[#bebebe]">1 min ago</span>
              <span className="font-semibold text-white">User #2855</span>
            </div>
            <p className="w-42 rounded-bl-[11px] rounded-br-[11px] rounded-tr-[11px] bg-[#005640] px-1.75 py-1.5 text-[7px] leading-normal text-white">
              Great, thanks a lot 😍 A PDF will be fine
            </p>
          </div>

          {/* Typing indicator */}
          <p className="flex items-center gap-1 text-[7px] text-[#bebebe]">
            <span className="flex items-center gap-0.5" aria-hidden>
              <span className="h-1 w-1 animate-bounce rounded-full bg-white/50" />
              <span className="h-1 w-1 animate-bounce rounded-full bg-white/50 [animation-delay:150ms]" />
              <span className="h-1 w-1 animate-bounce rounded-full bg-white/50 [animation-delay:300ms]" />
            </span>
            User typing
          </p>
        </div>

        <div className="h-px w-full bg-[#303239]" />
      </div>

      <div className="mt-1.75 flex items-center justify-between gap-2">
        <div className="h-4.75 w-25.5 rounded bg-[#303239]" />
        <ChatActions />
      </div>
    </div>
  );
}
