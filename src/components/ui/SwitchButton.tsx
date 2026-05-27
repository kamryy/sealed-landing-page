import { useState } from "react";

interface SwitchProps {
  defaultValue?: boolean;
  onChange?: (value: boolean) => void;
  activeColor?: string;
}

export default function Switch({
  defaultValue = false,
  onChange,
  activeColor = "#6bfad6",
}: SwitchProps) {
  const [value, setValue] = useState<boolean>(defaultValue);

  const isB2B = value === true;

  const handleToggle = () => {
    const next: boolean = !value;
    setValue(next);
    onChange?.(next);
  };

  return (
    <div className="wrapper">
      <div
        className="switch-container"
        onClick={handleToggle}
        role="switch"
        aria-checked={isB2B}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            handleToggle();
          }
        }}
      >
        <span className={`label ${!isB2B ? "active" : ""}`}>Individual</span>

        <div className={`track ${isB2B ? "on" : "off"}`}>
          <div className="thumb" />
        </div>

        <span className={`label ${isB2B ? "active" : ""}`}>Business</span>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&display=swap');

        .wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: 'DM Sans', sans-serif;
          background: transparent;
          position: relative;
          z-index: 0;
        }

        .switch-container {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 6px 12px;
          background: rgba(255,255,255,0.06);
          border: 0.5px solid rgba(255,255,255,0.12);
          border-radius: 999px;
          cursor: pointer;
          user-select: none;
          outline: none;
        }

        .switch-container:focus-visible {
          box-shadow: 0 0 0 2px ${activeColor};
        }

        .label {
          font-size: 13px;
          font-weight: 400;
          color: rgba(255,255,255,0.4);
          transition: color 0.25s, font-weight 0.25s;
        }

        .label.active {
          font-weight: 700;
          color: #ffffff;
        }

        .track {
          position: relative;
          width: 52px;
          height: 28px;
          border-radius: 14px;
          transition: background 0.25s;
          flex-shrink: 0;
        }

        .track.on  { background: ${activeColor}; }
        .track.off { background: rgba(255,255,255,0.15); }

        .thumb {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #fff;
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }

        .track.on .thumb {
          transform: translateX(24px);
        }
      `}</style>
    </div>
  );
}
