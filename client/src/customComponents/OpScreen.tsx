import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import useShortCut from "../utils/useShortCut"; // Adjust the path as necessary

export default function OpScreen() {
    const [open, setOpen] = useState(false);
    const shortcutPressed = useShortCut("k", "metaKey");

    useEffect(() => {
        if (shortcutPressed) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [shortcutPressed]);

    return (
        <div className="text-white font-inter">
            <motion.div
                onClick={() => setOpen((t) => !t)}
                className="element flex justify-center items-center"
                style={
                    open
                        ? { position: "fixed", placeItems: "center", width: "90vw", height: "70%" }
                        : { height: 150, width: 250 }
                }
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                }}
                layout
            >
                Name
            </motion.div>
        </div>
    );
}