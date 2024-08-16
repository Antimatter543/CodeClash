import { motion } from "framer-motion";
import { useState } from "react";

export default function OpScreen() {
    const [open, setOpen] = useState(false);

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