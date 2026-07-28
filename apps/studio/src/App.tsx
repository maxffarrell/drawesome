import { useRef, useState } from "react";
import { Draw, type DrawHandle } from "drawesome";
import { Debug, type DebugState, defaults } from "./Debug";
import css from "./App.module.css";

/** Demo harness. The <Draw /> line is all a consumer writes. */
export default function App() {
  const [debug, setDebug] = useState<DebugState>(defaults);
  const draw = useRef<DrawHandle>(null);

  return (
    <div className={css.page}>
      <Draw
        ref={draw}
        placement={debug.placement}
        theme={debug.theme}
        chrome={debug.chrome}
        depth={debug.depth}
        ink={debug.ink}
        tooltips={debug.tooltips === false ? false : { scope: debug.tooltips }}
        eraser={debug.eraser}
        tools={debug.tools.length ? debug.tools : undefined}
        controls={debug.controls}
        settings={debug.settings}
        align={debug.align}
        look={debug.look}
        gauge={debug.gauge}
        shortcuts={debug.shortcuts}
        draggable={debug.draggable}
        /* The canvas colour is the host's call, not the component's —
           but a dark theme over a white page is nobody's intent. */
        background={
          debug.transparent
            ? "checker"
            : debug.theme === "dark"
              ? "#17171a"
              : "#ffffff"
        }
      />
      <Debug value={debug} onChange={setDebug} draw={draw} />
    </div>
  );
}
