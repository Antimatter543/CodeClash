import { useState, useEffect } from "react";

function useShortCut(targetKey: string, modifierKey: "metaKey" | "ctrlKey" | "altKey" | "shiftKey"): boolean {
    const [keyPressed, setKeyPressed] = useState(false);

    useEffect(() => {
        const handleKeyEvent = (event: KeyboardEvent) => {
            const isTargetKeyPressed = event.key.toLowerCase() === targetKey;
            const isModifierKeyPressed = event[modifierKey];

            // Update keyPressed state based on both keys being pressed
            setKeyPressed(isTargetKeyPressed && isModifierKeyPressed);
        };

        window.addEventListener("keydown", handleKeyEvent);
        window.addEventListener("keyup", handleKeyEvent);

        return () => {
            window.removeEventListener("keydown", handleKeyEvent);
            window.removeEventListener("keyup", handleKeyEvent);
        };
    }, [targetKey, modifierKey]);

    return keyPressed;
}

export default useShortCut;