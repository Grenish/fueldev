import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="w-full p-2 fixed">
      <nav className="w-10/12 flex mx-auto justify-between items-center p-2 border rounded-xl">
        <div className="inline-flex items-center select-none">
          <Image src={"/logo-min.png"} alt="logo" width={40} height={40} />
          <h2 className="text-xl font-semibold">FuelDev</h2>
        </div>
        <div>
          <Link href={"/auth/login"}>
            <Button>Login</Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}
