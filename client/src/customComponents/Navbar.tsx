import { Button } from "@/components/ui/button";

export default function Navbar () {
    return(
        <div className="flex justify-between w-full border-b-[1px] border-neutral-200 font-inter px-10 py-5">
            <h1 className="text-[1.5rem]">
                CodeClash.
            </h1>

            <section className="flex gap-10 items-center">
                <div className="flex items-center justify-center space-x-4">
                    <div className="size-3 border border-neutral-300 bg-green-500 rounded-full"></div>
                    <div className="size-3 border border-neutral-300 rounded-full"></div>
                    <div className="size-3 border border-neutral-300 rounded-full"></div>
                    <div className="size-3 border border-neutral-300 rounded-full"></div>
                    <div className="size-3 border border-neutral-300 rounded-full"></div>
                </div>
                <p>
                    Timer
                </p>

                <Button>
                    Invite
                </Button>
            </section>
        </div>
    )
}