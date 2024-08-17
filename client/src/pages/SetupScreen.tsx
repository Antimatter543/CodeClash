import { Button } from "@/components/ui/button";
import Github from '../assets/svg/svg'


export default function SetupScreen () {

    return (
        <div className="font-inter w-full h-full flex flex-col justify-center items-center gap-[4rem]">
            <section className="text-center">
                <p className="font-semibold text-[2rem]">Show who's the real dev.</p>
                <p className="mt-2">Online PvP leetcode. Like Tetris but leetcode.</p>
            </section>
            
            <Button className="gap-2" variant="outline">Start with your <Github/></Button>
        </div>
    )
}