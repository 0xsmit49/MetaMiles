import IconContainer from "@workspace/ui/components/ui/floating-dock";
import { useMotionValue } from "motion/react";
import { IconHome, IconUser, IconSettings } from "@tabler/icons-react";
import WalletConnector from "./Headers";

export default function MyCustomComponent() {
  const mouseX = useMotionValue(Infinity);

  return (
    <div className="w-screen flex items-center justify-center py-4">
      <div
        className="relative flex items-center bg-gradient-to-r from-slate-900/95 via-gray-900/95 to-slate-900/95 backdrop-blur-lg border border-orange-500/20 rounded-2xl max-w-7xl w-full px-8 py-6 shadow-2xl"
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        style={{
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(249, 115, 22, 0.1)"
        }}
      >
        {/* MetaMask Title (Left side) */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col text-left">
          <span
            style={{
              fontFamily: "Holtwood One SC, serif",
              fontSize: "2rem",
              letterSpacing: "0.15rem",
              background: "linear-gradient(-45deg, #f97316, #f59e0b, #fb923c)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: "1",
              filter: "drop-shadow(0 2px 4px rgba(249, 115, 22, 0.3))"
            }}
          >
            MetaMiles
          </span>
          <span className="text-xs text-gray-400 mt-1 tracking-wider font-medium">
            CRYPTO DEBIT
          </span>
        </div>

        {/* WalletConnector (Right side) */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2">
          <WalletConnector />
        </div>

        {/* Icon Group (Centered) */}
        <div className="flex items-center gap-6 mx-auto">
          <IconContainer
            mouseX={mouseX}
            title="Home"
            icon={<IconHome className="text-orange-400" />}
            href="/home"
          />
          <IconContainer
            mouseX={mouseX}
            title="Profile"
            icon={<IconUser className="text-orange-400" />}
            href="/profile"
          />
          <IconContainer
            mouseX={mouseX}
            title="Settings"
            icon={<IconSettings className="text-orange-400" />}
            href="/settings"
          />
        </div>

        {/* Subtle glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/5 via-transparent to-orange-500/5 pointer-events-none" />
      </div>
    </div>
  );
}