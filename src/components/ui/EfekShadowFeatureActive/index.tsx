import { useEffect, useState } from "react";
import { HatGlasses } from "lucide-react";

interface EfekShadowFeatureActiveProps {
  show: boolean;
  onComplete?: () => void;
}

const EfekShadowFeatureActive = ({
  show,
  onComplete,
}: EfekShadowFeatureActiveProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!show) {
      setVisible(false);
      return;
    }

    setVisible(true);

    const timer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 4000);

    return () => clearTimeout(timer);
  }, [show, onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-9999 overflow-hidden">
      {/* ================================================
          SHADOW OVERLAY
      ================================================= */}
      <div className="absolute inset-0 animate-shadow-overlay">
        {/* Global glow */}
        <div
          className="
            absolute
            inset-0
            animate-shadow-glow
            bg-[radial-gradient(circle_at_top_left,rgba(0,0,0,0.25),transparent_35%),radial-gradient(circle_at_top_right,rgba(0,0,0,0.25),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(0,0,0,0.25),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(0,0,0,0.25),transparent_35%)]
          "
        />

        {/* Top left */}
        <div
          className="
            absolute
            -left-32
            -top-32
            h-80
            w-80
            animate-shadow-corner
            rounded-full
            bg-black/35
            blur-3xl
          "
        />

        {/* Top right */}
        <div
          className="
            absolute
            -right-32
            -top-32
            h-80
            w-80
            animate-shadow-corner
            rounded-full
            bg-black/35
            blur-3xl
          "
        />

        {/* Bottom left */}
        <div
          className="
            absolute
            -bottom-32
            -left-32
            h-80
            w-80
            animate-shadow-corner
            rounded-full
            bg-black/35
            blur-3xl
          "
        />

        {/* Bottom right */}
        <div
          className="
            absolute
            -bottom-32
            -right-32
            h-80
            w-80
            animate-shadow-corner
            rounded-full
            bg-black/35
            blur-3xl
          "
        />
      </div>

      {/* ================================================
          CENTER OBJECT
      ================================================= */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="
            flex
            h-24
            w-24
            animate-shadow-object
            items-center
            justify-center
            rounded-3xl
            bg-white
            shadow-[0_0_80px_rgba(0,0,0,0.45)]
          "
        >
          <HatGlasses strokeWidth={2.5} className="size-12 text-base-content" />
        </div>
      </div>
    </div>
  );
};

export default EfekShadowFeatureActive;
